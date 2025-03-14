// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, db, getDoc, doc, updateDoc } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { Box, TextField, Button, Container, Typography, Paper } from "@mui/material";

// const EditProfile = () => {
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

//   const handleChange = (e) => {
//     setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     if (!userDetails || !userDetails.user_email) return;

//     try {
//       const userRef = doc(db, "customers", userDetails.user_email);
//       await updateDoc(userRef, userDetails);
//       alert("Profile updated successfully!");
//       navigate("/user-dashboard");
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       alert("Failed to update profile.");
//     }
//   };

//   if (loading) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <Container maxWidth="sm">
//       <Paper sx={{ p: 4, mt: 4, boxShadow: 3 }}>
//         <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
//           Edit Profile
//         </Typography>
//         {userDetails ? (
//           <>
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Name"
//               name="user_name"
//               value={userDetails.user_name || ""}
//               onChange={handleChange}
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Phone"
//               name="user_phone"
//               value={userDetails.user_phone || ""}
//               onChange={handleChange}
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="Aadhar"
//               name="user_adhar"
//               value={userDetails.user_adhar || ""}
//               onChange={handleChange}
//             />
//             <TextField
//               fullWidth
//               margin="normal"
//               label="PAN"
//               name="user_pan"
//               value={userDetails.user_pan || ""}
//               onChange={handleChange}
//             />

//             <Box mt={2} display="flex" justifyContent="space-between">
//               <Button variant="contained" color="secondary" onClick={() => navigate("/user-dashboard")}>
//                 Cancel
//               </Button>
//               <Button variant="contained" color="primary" onClick={handleUpdate}>
//                 OK
//               </Button>
//             </Box>
//           </>
//         ) : (
//           <Typography color="error">User not found. Please sign in.</Typography>
//         )}
//       </Paper>
//     </Container>
//   );
// };

// export default EditProfile;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, getDoc, doc, updateDoc } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Box, TextField, Button, Container, Typography, Paper } from "@mui/material";

const EditProfile = () => {
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

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!userDetails || !userDetails.user_email) return;

    try {
      const userRef = doc(db, "customers", userDetails.user_email);
      await updateDoc(userRef, {
        user_name: userDetails.user_name,
        user_phone: userDetails.user_phone,
      });
      alert("Profile updated successfully!");
      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" textAlign="center" mb={2}>
          Edit Profile
        </Typography>
        {userDetails ? (
          <>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="user_name"
              value={userDetails.user_name || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="user_phone"
              value={userDetails.user_phone || ""}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Aadhar"
              name="user_adhar"
              value={userDetails.user_adhar || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="PAN"
              name="user_pan"
              value={userDetails.user_pan || ""}
              InputProps={{ readOnly: true }}
            />

            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="contained" color="secondary" onClick={() => navigate("/user-dashboard")}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleUpdate}>
                OK
              </Button>
            </Box>
          </>
        ) : (
          <Typography color="error">User not found. Please sign in.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default EditProfile;
