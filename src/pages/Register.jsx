import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAdhar, setUserAdhar] = useState("");
  const [userPan, setUserPan] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Function to generate a unique 7-digit numerical user_id
  const generateUniqueUserId = async () => {
    let uniqueId;
    let exists = true;

    while (exists) {
      uniqueId = Math.floor(1000000 + Math.random() * 9000000); // Generate a 7-digit number
      const userQuery = query(collection(db, "customers"), where("user_id", "==", uniqueId));
      const querySnapshot = await getDocs(userQuery);
      exists = !querySnapshot.empty; // If user_id exists, generate again
    }

    return uniqueId;
  };

  // const handleRegister = async () => {
  //   setError("");

  //   if (!userName || !userEmail || !userPhone || !userAdhar || !userPan || !password) {
  //     setError("All fields are required.");
  //     return;
  //   }

  //   try {
  //     // Create user in Firebase Authentication
  //     const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
  //     const userId = await generateUniqueUserId(); // Generate unique numeric ID

  //     // Save user details in Firestore customers collection
  //     await setDoc(doc(db, "customers", userEmail), {
  //       user_id: userId, // Store as a number
  //       user_name: userName,
  //       user_email: userEmail,
  //       user_phone: userPhone,
  //       user_adhar: userAdhar,
  //       user_pan: userPan,
  //     });

  //     alert("Registration Successful!");
  //     navigate("/login");
  //   } catch (err) {
  //     console.error("Registration error:", err);
  //     setError("Failed to register. Email may already be in use.");
  //   }
  // };



  const handleRegister = async () => {
    setError("");
  
    if (!userName || !userEmail || !userPhone || !userAdhar || !userPan || !password) {
      setError("All fields are required.");
      return;
    }
  
    if (isNaN(userPhone) || isNaN(userAdhar)) {
      setError("Phone and Aadhar number must be numeric.");
      return;
    }
  
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
      const userId = await generateUniqueUserId(); // Generate unique numeric ID
  
      // Save user details in Firestore customers collection
      await setDoc(doc(db, "customers", userEmail), {
        user_id: userId, // Store as a number
        user_name: userName,
        user_email: userEmail,
        user_phone: Number(userPhone), // Convert to number
        user_adhar: Number(userAdhar), // Convert to number
        user_pan: userPan,
      });
  
      alert("Registration Successful!");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register. Email may already be in use.");
    }
  };
  

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f7f7f7" }}>
      <Paper elevation={10} sx={{ padding: 4, width: 400, textAlign: "center", borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Register
        </Typography>

        {error && <Typography color="error" mb={2}>{error}</Typography>}

        <TextField fullWidth label="Full Name" variant="outlined" margin="normal" value={userName} onChange={(e) => setUserName(e.target.value)} />
        <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
        <TextField fullWidth label="Phone Number" variant="outlined" margin="normal" value={userPhone} onChange={(e) => setUserPhone(e.target.value)} />
        <TextField fullWidth label="Aadhar Number" variant="outlined" margin="normal" value={userAdhar} onChange={(e) => setUserAdhar(e.target.value)} />
        <TextField fullWidth label="PAN Number" variant="outlined" margin="normal" value={userPan} onChange={(e) => setUserPan(e.target.value)} />
        <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleRegister}>
          Register
        </Button>
      </Paper>
    </Box>
  );
};

export default Register;
