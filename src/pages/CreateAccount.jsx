import { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebaseConfig";
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const CreateAccount = () => {
  const [acctType, setAcctType] = useState("savings");
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Listen for authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ User detected:", user.email);
        setUserEmail(user.email);
        await fetchUserDetails(user.email);
      } else {
        console.log("❌ No authenticated user found.");
        setError("User is not logged in. Please sign in first.");
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch user details from Firestore customers collection
  const fetchUserDetails = async (email, retries = 2) => {
    try {
      const userRef = doc(db, "customers", email);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userDoc = userSnap.data();
        console.log("✅ User data found:", userDoc);

        setUserData({
          userid: Number(userDoc.user_id),
          user_name: userDoc.user_name,
          user_phone: Number(userDoc.user_phone), // Store phone as number
          user_pan: userDoc.user_pan,
          user_adhar: Number(userDoc.user_adhar), // Store Aadhaar as number
        });

        return;
      }

      if (retries > 0) {
        console.log("⚠️ Retrying fetch...");
        setTimeout(() => fetchUserDetails(email, retries - 1), 2000);
      } else {
        setError("❌ User data not found. Please register first.");
      }
    } catch (err) {
      console.error("❌ Error fetching user details:", err);
      setError("Failed to retrieve user data.");
    }
  };

  // ✅ Generate a unique 7-digit account number
  const generateAccountNumber = async () => {
    let uniqueNumber;
    let exists = true;

    while (exists) {
      uniqueNumber = Math.floor(1000000 + Math.random() * 9000000);
      const accountRef = doc(db, "bank_account", uniqueNumber.toString());
      const accountSnap = await getDoc(accountRef);
      exists = accountSnap.exists();
    }

    return uniqueNumber;
  };

  // ✅ Handle account creation
  const handleCreateAccount = async () => {
    if (!userEmail || !userData) {
      setError("❌ User details missing. Try again.");
      return;
    }

    try {
      const accountNumber = await generateAccountNumber();

      const accountData = {
        acct_number: accountNumber,
        acct_balance: 1000,
        acct_limit: 0,
        acct_status: "request",
        acct_type: acctType,
        acct_created_at: new Date(),
        user_email: userEmail,
        user_name: userData.user_name,
        user_phone: userData.user_phone, // ✅ Store phone as number
        user_pan: userData.user_pan,
        user_adhar: userData.user_adhar, // ✅ Store Aadhaar as number
        userid: userData.userid,
      };

      console.log("📌 Creating new bank account:", accountData);

      // ✅ 1. Save in 'bank_account' collection
      const bankAccountRef = doc(db, "bank_account", accountNumber.toString());
      await setDoc(bankAccountRef, accountData);

      // ✅ 2. Verify if it exists in Firestore
      const checkAccount = await getDoc(bankAccountRef);
      if (!checkAccount.exists()) {
        console.error("❌ Error: Account was not saved properly!");
        setError("Account creation failed. Please try again.");
        return;
      }

      console.log("✅ Account saved in 'bank_account' collection!");

      // ✅ 3. Update customers collection with new account number
      const customerRef = doc(db, "customers", userEmail);
      await updateDoc(customerRef, {
        bank_accounts: arrayUnion(accountNumber),
      });

      console.log(`✅ Account number ${accountNumber} added to user's bank_accounts array!`);

      alert("✅ Account Created Successfully! Pending approval.");
      navigate("/user-dashboard");
    } catch (err) {
      console.error("❌ Error creating account:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <Paper sx={{ p: 4, textAlign: "center", maxWidth: 500, margin: "auto" }}>
      <Typography variant="h5" mb={3}>Create New Bank Account</Typography>
      
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Account Type</InputLabel>
        <Select value={acctType} onChange={(e) => setAcctType(e.target.value)}>
          <MenuItem value="savings">Savings</MenuItem>
          <MenuItem value="current">Current</MenuItem>
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" fullWidth onClick={handleCreateAccount}>
        Create Account
      </Button>

      {error && <Typography color="error" mt={2}>{error}</Typography>}
    </Paper>
  );
};

export default CreateAccount;

