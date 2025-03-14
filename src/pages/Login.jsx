// // import { useState } from "react";
// // import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
// // import { useNavigate } from "react-router-dom";
// // import { auth } from "../firebaseConfig";
// // import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// // const Login = () => {
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [resetSuccess, setResetSuccess] = useState("");
// //   const navigate = useNavigate();

// //   const handleLogin = async () => {
// //     setError("");
// //     setResetSuccess("");

// //     if (!email || !password) {
// //       setError("Email and Password are required.");
// //       return;
// //     }

// //     try {
// //       await signInWithEmailAndPassword(auth, email, password);
// //       alert("Login Successful!");
// //       navigate("/user-dashboard"); // Redirect to dashboard or home page
// //     } catch (err) {
// //       console.error("Login error:", err);
// //       setError("Invalid email or password.");
// //     }
// //   };

// //   const handleForgotPassword = async () => {
// //     if (!email) {
// //       setError("Enter your email to reset password.");
// //       return;
// //     }

// //     try {
// //       await sendPasswordResetEmail(auth, email);
// //       setResetSuccess("Password reset link sent to your email.");
// //     } catch (err) {
// //       console.error("Password reset error:", err);
// //       setError("Failed to send reset email. Check if the email is correct.");
// //     }
// //   };

// //   return (
// //     <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f7f7f7" }}>
// //       <Paper elevation={10} sx={{ padding: 4, width: 400, textAlign: "center", borderRadius: 2 }}>
// //         <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
// //           Login
// //         </Typography>

// //         {error && <Typography color="error" mb={2}>{error}</Typography>}
// //         {resetSuccess && <Typography color="green" mb={2}>{resetSuccess}</Typography>}

// //         <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
// //         <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

// //         <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
// //           Login
// //         </Button>

// //         <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
// //           <Link href="#" onClick={handleForgotPassword} sx={{ cursor: "pointer" }}>
// //             Forgot Password?
// //           </Link>
// //           <Link href="/register" sx={{ cursor: "pointer" }}>
// //             Create an Account
// //           </Link>
// //         </Box>
// //       </Paper>
// //     </Box>
// //   );
// // };

// // export default Login;



// import { useState } from "react";
// import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [resetSuccess, setResetSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     setError("");
//     setResetSuccess("");

//     if (!email || !password) {
//       setError("Email and Password are required.");
//       return;
//     }

//     try {
//       await signInWithEmailAndPassword(auth, email, password);
      
//       // Admin Check
//       if (email === "subharanjini11@gmail.com") {
//         navigate("/admin-dashboard"); // Redirect to admin dashboard
//       } else {
//         navigate("/user-dashboard"); // Redirect to user dashboard
//       }

//       alert("Login Successful!");
//     } catch (err) {
//       console.error("Login error:", err);
//       setError("Invalid email or password.");
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!email) {
//       setError("Enter your email to reset password.");
//       return;
//     }

//     try {
//       await sendPasswordResetEmail(auth, email);
//       setResetSuccess("Password reset link sent to your email.");
//     } catch (err) {
//       console.error("Password reset error:", err);
//       setError("Failed to send reset email. Check if the email is correct.");
//     }
//   };

//   return (
//     <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f7f7f7" }}>
//       <Paper elevation={10} sx={{ padding: 4, width: 400, textAlign: "center", borderRadius: 2 }}>
//         <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
//           Login
//         </Typography>

//         {error && <Typography color="error" mb={2}>{error}</Typography>}
//         {resetSuccess && <Typography color="green" mb={2}>{resetSuccess}</Typography>}

//         <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
//         <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />

//         <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
//           Login
//         </Button>

//         <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
//           <Link href="#" onClick={handleForgotPassword} sx={{ cursor: "pointer" }}>
//             Forgot Password?
//           </Link>
//           <Link href="/register" sx={{ cursor: "pointer" }}>
//             Create an Account
//           </Link>
//         </Box>
//       </Paper>
//     </Box>
//   );
// };

// export default Login;




import { useState } from "react";
import { Box, TextField, Button, Typography, Paper, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login = () => {
  const [userId, setUserId] = useState(""); // Changed from email to userId
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setResetSuccess("");

    if (!userId || !password) {
      setError("User ID and Password are required.");
      return;
    }

    try {
      let email = "";

      // Admin Login Check
      if (userId === "1111111") {
        email = "subharanjini11@gmail.com"; // Admin email
      } else {
        // Fetch email from Firestore based on User ID
        const usersRef = collection(db, "customers");
        const q = query(usersRef, where("user_id", "==", Number(userId))); // Convert input to number
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setError("User ID not found.");
          return;
        }

        // Get the first matching document
        const userData = querySnapshot.docs[0].data();
        email = userData.user_email;
      }

      // Authenticate using email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Redirect based on user type
      if (userId === "1111111") {
        navigate("/admin-dashboard"); // Admin Dashboard
      } else {
        navigate("/user-dashboard"); // User Dashboard
      }

      alert("Login Successful!");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid User ID or password.");
    }
  };

  const handleForgotPassword = async () => {
    if (!userId) {
      setError("Enter your User ID to reset password.");
      return;
    }

    try {
      // Fetch email from Firestore based on User ID
      const usersRef = collection(db, "customers");
      const q = query(usersRef, where("user_id", "==", Number(userId)));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("User ID not found.");
        return;
      }

      const userData = querySnapshot.docs[0].data();
      const email = userData.user_email;

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      setResetSuccess("Password reset link sent to your email.");
    } catch (err) {
      console.error("Password reset error:", err);
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#f7f7f7" }}>
      <Paper elevation={10} sx={{ padding: 4, width: 400, textAlign: "center", borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Login
        </Typography>

        {error && <Typography color="error" mb={2}>{error}</Typography>}
        {resetSuccess && <Typography color="green" mb={2}>{resetSuccess}</Typography>}

        <TextField
          fullWidth
          label="User ID"
          type="text"
          variant="outlined"
          margin="normal"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Link href="#" onClick={handleForgotPassword} sx={{ cursor: "pointer" }}>
            Forgot Password?
          </Link>
          <Link href="/register" sx={{ cursor: "pointer" }}>
            Create an Account
          </Link>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
