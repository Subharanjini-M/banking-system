import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Container,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CurrentAccount = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentAccounts, setCurrentAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({ open: false, acctNumber: null });

  const navigate = useNavigate();

  // 🔹 Fetch the current authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setError("User not authenticated.");
        setLoading(false);
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // 🔹 Fetch user details from Firestore once email is available
  useEffect(() => {
    if (!userEmail) return;

    const fetchUserData = async () => {
      try {
        const userRef = doc(db, "customers", userEmail);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userDoc = userSnap.data();
          console.log("✅ User Data:", userDoc);

          setUserData(userDoc);

          if (Array.isArray(userDoc.bank_accounts)) {
            fetchBankAccounts(userDoc.bank_accounts);
          } else {
            setError("No linked bank accounts found.");
            setLoading(false);
          }
        } else {
          setError("User details not found.");
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Error fetching user details:", err);
        setError("Failed to fetch user details.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  // 🔹 Fetch bank account details
  const fetchBankAccounts = async (accountNumbers) => {
    try {
      const accounts = [];
      for (let acctNumber of accountNumbers) {
        const accountRef = doc(db, "bank_account", acctNumber.toString());
        const accountSnap = await getDoc(accountRef);

        if (accountSnap.exists()) {
          const accountData = accountSnap.data();
          if (accountData.acct_type === "current") {
            accounts.push(accountData);
          }
        }
      }

      if (accounts.length > 0) {
        setCurrentAccounts(accounts);
      } else {
        setError("No current accounts found.");
      }
    } catch (err) {
      console.error("❌ Error fetching bank accounts:", err);
      setError("Failed to retrieve bank account data.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Account Deletion
  const handleCloseAccount = async () => {
    if (!confirmDialog.acctNumber) return;

    try {
      // 1️⃣ Delete from bank_account collection
      await deleteDoc(doc(db, "bank_account", confirmDialog.acctNumber.toString()));
      console.log(`✅ Account ${confirmDialog.acctNumber} deleted from bank_account collection`);

      // 2️⃣ Remove from customer's bank_accounts array
      if (userEmail) {
        const userRef = doc(db, "customers", userEmail);
        await updateDoc(userRef, {
          bank_accounts: arrayRemove(confirmDialog.acctNumber),
        });
        console.log(`✅ Account ${confirmDialog.acctNumber} removed from user's bank_accounts array`);
      }

      // 3️⃣ Update state to reflect changes
      setCurrentAccounts((prev) =>
        prev.filter((acc) => acc.acct_number !== confirmDialog.acctNumber)
      );

      setConfirmDialog({ open: false, acctNumber: null });
    } catch (err) {
      console.error("❌ Error closing account:", err);
      setError("Failed to close account.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" fontWeight="bold" textAlign="center" mt={4} mb={3} color="primary">
        Current Account Details
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", margin: "auto" }} />
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        currentAccounts.map((account, index) => (
          <Paper key={index} sx={{ p: 4, mb: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6">Account Number: {account.acct_number}</Typography>
            <Typography>Balance: ₹{account.acct_balance}</Typography>
            <Typography>Status: {account.acct_status}</Typography>
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              onClick={() => setConfirmDialog({ open: true, acctNumber: account.acct_number })}
            >
              Close Account
            </Button>
          </Paper>
        ))
      )}

      {/* 🔹 Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, acctNumber: null })}>
        <DialogTitle>Are you sure you want to close this account?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, acctNumber: null })}>Cancel</Button>
          <Button onClick={handleCloseAccount} color="error" variant="contained">
            Yes, Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CurrentAccount;
