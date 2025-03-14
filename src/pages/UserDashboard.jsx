import { 
  Box, Typography, Grid, Paper, Container, Button, Card, CardContent 
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, getDoc, doc } from "../firebaseConfig"; 
import { onAuthStateChanged } from "firebase/auth";

const UserDashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userEmail = user.email;
          if (!userEmail) {
            console.error("User email not found!");
            return;
          }

          // Fetch user details from Firestore
          const userRef = doc(db, "customers", userEmail);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setUserDetails(userSnap.data());
          } else {
            console.error("No user data found in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No authenticated user found.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        padding: 4,
      }}
    >
      <Container maxWidth="md">
        {userDetails ? (
          <Card sx={{ mb: 4, p: 2, backgroundColor: "white", boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Welcome, {userDetails.user_name}
              </Typography>
              <Typography>User ID: {userDetails.user_id}</Typography>
              <Typography>Email: {userDetails.user_email}</Typography>
              <Typography>Phone: {userDetails.user_phone}</Typography>
              <Typography>Aadhar: {userDetails.user_adhar}</Typography>
              <Typography>PAN: {userDetails.user_pan}</Typography>
            </CardContent>

            <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit
             </Button>

          </Card>

          
        ) : (
          <Typography color="error">User not found. Please sign in.</Typography>
        )}

        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4} color="primary">
          User Dashboard
        </Typography>

        <Grid container spacing={4}>
          {/* Bank Accounts */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: "#1976d2",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography variant="h6" mb={2}>
                Your Bank Accounts
              </Typography>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#1976d2",
                  m: 1,
                }}
                onClick={() => navigate("/savings-account")}
              >
                View Savings Account
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "white",
                  color: "#1976d2",
                  m: 1,
                }}
                onClick={() => navigate("/current-account")}
              >
                View Current Account
              </Button>
            </Paper>
          </Grid>

          

          {/* Transfer Money */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Typography variant="h6">Transfer Money</Typography>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={() => navigate("/transfer-money")}
              >
                Transfer
              </Button>
            </Paper>
          </Grid>

          {/* Apply for Loan */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Typography variant="h6">Apply for Loan</Typography>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => navigate("/apply-loan")}
              >
                Apply Now
              </Button>
            </Paper>
          </Grid>

          {/* Mutual Funds */}
          {/* View Balance */}
          <Grid item xs={12} sm={6} md={4}>
            <Paper
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: "white",
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <Typography variant="h6">Mutual Funds</Typography>
              <Button
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "yellow",
                  color: "black",
                  "&:hover": { backgroundColor: "#ffcc00" },
                }}
                onClick={() => navigate("/mutual-funds")}
              >
                Invest Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;


// import { 
//   Box, Typography, Grid, Paper, Container, Button, Card, CardContent 
// } from "@mui/material";
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, db, getDoc, doc } from "../firebaseConfig"; 
// import { onAuthStateChanged } from "firebase/auth";

// const UserDashboard = () => {
//   const [userDetails, setUserDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userEmail = user.email;
//           if (!userEmail) {
//             console.error("User email not found!");
//             return;
//           }

//           // Fetch user details from Firestore
//           const userRef = doc(db, "customers", userEmail);
//           const userSnap = await getDoc(userRef);

//           if (userSnap.exists()) {
//             setUserDetails(userSnap.data());
//           } else {
//             console.error("No user data found in Firestore!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       } else {
//         console.error("No authenticated user found.");
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Box
//       sx={{
//         flex: 1,
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         minHeight: "100vh",
//         backgroundColor: "#f8f9fa",
//         padding: 4,
//       }}
//     >
//       <Container maxWidth="md">
//         {userDetails ? (
//           <Card sx={{ mb: 4, p: 2, backgroundColor: "white", boxShadow: 3 }}>
//             <CardContent>
//               <Box display="flex" justifyContent="space-between" alignItems="center">
//                 <Typography variant="h5" fontWeight="bold" color="primary">
//                   Welcome, {userDetails.user_name}
//                 </Typography>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={() => navigate("/edit-profile")}
//                 >
//                   Edit
//                 </Button>
//               </Box>
//               <Typography>User ID: {userDetails.user_id}</Typography>
//               <Typography>Email: {userDetails.user_email}</Typography>
//               <Typography>Phone: {userDetails.user_phone}</Typography>
//               <Typography>Aadhar: {userDetails.user_adhar}</Typography>
//               <Typography>PAN: {userDetails.user_pan}</Typography>
//             </CardContent>
//           </Card>
//         ) : (
//           <Typography color="error">User not found. Please sign in.</Typography>
//         )}

//         <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4} color="primary">
//           User Dashboard
//         </Typography>

//         <Grid container spacing={4}>
//           {/* Bank Accounts */}
//           <Grid item xs={12}>
//             <Paper
//               sx={{
//                 p: 4,
//                 borderRadius: 2,
//                 backgroundColor: "#1976d2",
//                 color: "white",
//                 textAlign: "center",
//               }}
//             >
//               <Typography variant="h6" mb={2}>
//                 Your Bank Accounts
//               </Typography>
//               <Button
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "white",
//                   color: "#1976d2",
//                   m: 1,
//                 }}
//                 onClick={() => navigate("/savings-account")}
//               >
//                 View Savings Account
//               </Button>
//               <Button
//                 variant="contained"
//                 sx={{
//                   backgroundColor: "white",
//                   color: "#1976d2",
//                   m: 1,
//                 }}
//                 onClick={() => navigate("/current-account")}
//               >
//                 View Current Account
//               </Button>
//             </Paper>
//           </Grid>

//           {/* View Balance */}
//           <Grid item xs={12} sm={6} md={4}>
//             <Paper
//               sx={{
//                 p: 4,
//                 textAlign: "center",
//                 borderRadius: 2,
//                 backgroundColor: "white",
//                 boxShadow: 3,
//                 transition: "0.3s",
//                 "&:hover": { boxShadow: 6 },
//               }}
//             >
//               <Typography variant="h6">View balance</Typography>
//               <Button
//                 variant="contained"
//                 sx={{
//                   mt: 2,
//                   backgroundColor: "yellow",
//                   color: "black",
//                   "&:hover": { backgroundColor: "#ffcc00" },
//                 }}
//                 onClick={() => navigate("/view-balance")}
//               >
//                 View Balance
//               </Button>
//             </Paper>
//           </Grid>

//           {/* Transfer Money */}
//           <Grid item xs={12} sm={6} md={4}>
//             <Paper
//               sx={{
//                 p: 4,
//                 textAlign: "center",
//                 borderRadius: 2,
//                 backgroundColor: "white",
//                 boxShadow: 3,
//                 transition: "0.3s",
//                 "&:hover": { boxShadow: 6 },
//               }}
//             >
//               <Typography variant="h6">Transfer Money</Typography>
//               <Button
//                 variant="contained"
//                 color="success"
//                 sx={{ mt: 2 }}
//                 onClick={() => navigate("/transfer-money")}
//               >
//                 Transfer
//               </Button>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>
//     </Box>
//   );
// };

// export default UserDashboard;
