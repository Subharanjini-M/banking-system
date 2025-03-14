import React, { useState, useEffect } from "react";
import { db, auth } from "../firebaseConfig";
import {
  collection, addDoc, getDoc, getDocs, query, where, doc, updateDoc
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Button, TextField, Typography, Box, MenuItem } from "@mui/material";


const TransactionForm = () => {
  const [transactionType, setTransactionType] = useState("withdraw");
  const [fromAcct, setFromAcct] = useState("");
  const [toAcct, setToAcct] = useState("");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const customerRef = doc(db, "customers", currentUser.email);
          const customerSnap = await getDoc(customerRef);

          if (customerSnap.exists()) {
            const customerData = customerSnap.data();
            setLinkedAccounts(customerData.bank_accounts || []);
          }
        } catch (error) {
          console.error("Error fetching user accounts:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const generateTransactionID = () => Math.floor(1000000 + Math.random() * 9000000);

  const handleTransaction = async () => {
    if (!fromAcct || !amount || (transactionType === "transfer" && !toAcct)) {
      alert("Please fill in all required fields.");
      return;
    }

    const transactionID = generateTransactionID();
    const transactionData = {
      transaction_type: transactionType,
      from_acct: Number(fromAcct),
      to_acct: transactionType === "transfer" ? Number(toAcct) : "",
      from_IFSC: "SRB01",
      to_IFSC: transactionType === "transfer" ? "IOB01" : "SRB01",
      transaction_amt: Number(amount),
      transaction_id: transactionID,
      transaction_status: "pending",
      transaction_timestamp: new Date(),
    };

    try {
      if (!user) {
        alert("User not authenticated.");
        return;
      }

      // Fetch authenticated user's customer document
      const customerRef = doc(db, "customers", user.email);
      const customerSnap = await getDoc(customerRef);

      if (!customerSnap.exists()) {
        alert("User record not found.");
        return;
      }

      let customerData = customerSnap.data();
      let bankAccounts = customerData.bank_accounts || [];
      let selectedAcct = bankAccounts.find(acc => acc === Number(fromAcct));

      if (!selectedAcct) {
        alert("Invalid account number.");
        return;
      }

      // Fetch account balance from the bank_accounts collection
      const accountQuery = query(collection(db, "bank_account"), where("acct_number", "==", Number(fromAcct)));
      const accountSnapshot = await getDocs(accountQuery);

      if (accountSnapshot.empty) {
        alert("Account not found in bank_accounts collection.");
        return;
      }

      const accountDoc = accountSnapshot.docs[0];
      let accountData = accountDoc.data();

      // Withdrawal / Transfer: Check balance before proceeding
      if (transactionType !== "deposit") {
        if (accountData.acct_balance < Number(amount) + 1000) {
          alert("Insufficient balance. Minimum balance of ₹1000 must be maintained.");
          return;
        }
        accountData.acct_balance -= Number(amount);
      } else {
        accountData.acct_balance += Number(amount);
      }

      // Update account balance in bank_accounts collection
      await updateDoc(doc(db, "bank_account", accountDoc.id), {
        acct_balance: accountData.acct_balance,
      });

      // Handle transfer: Update recipient's balance
      if (transactionType === "transfer") {
        const toAccountQuery = query(collection(db, "bank_account"), where("acct_number", "==", Number(toAcct)));
        const toAccountSnapshot = await getDocs(toAccountQuery);

        if (toAccountSnapshot.empty) {
          alert("Recipient account not found.");
          return;
        }

        const toAccountDoc = toAccountSnapshot.docs[0];
        let toAccountData = toAccountDoc.data();
        toAccountData.acct_balance += Number(amount);

        await updateDoc(doc(db, "bank_account", toAccountDoc.id), {
          acct_balance: toAccountData.acct_balance,
        });
      }

      // Save transaction to Firestore
      await addDoc(collection(db, "transactions"), transactionData);
      alert("Transaction submitted successfully!");
      setAmount("");
      setFromAcct("");
      setToAcct("");
    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 400, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>🔄 Make a Transaction</Typography>

      <TextField
        label="Transaction Type"
        select
        value={transactionType}
        onChange={(e) => setTransactionType(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        <MenuItem value="withdraw">Withdraw</MenuItem>
        <MenuItem value="deposit">Deposit</MenuItem>
        <MenuItem value="transfer">Transfer</MenuItem>
      </TextField>

      <TextField
        label="From Account"
        type="number"
        value={fromAcct}
        onChange={(e) => setFromAcct(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {transactionType === "transfer" && (
        <TextField
          label="To Account"
          type="number"
          value={toAcct}
          onChange={(e) => setToAcct(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
      )}

      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button variant="contained" color="primary" onClick={handleTransaction} fullWidth>
        Submit
      </Button>
    </Box>
  );
};

export default TransactionForm;
