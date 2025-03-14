// import { AppBar, Toolbar, Typography, Button } from "@mui/material";
// import { Link } from "react-router-dom";

// const Header = () => {
//   return (
//     <AppBar position="static" color="primary">
//       <Toolbar>
//         <Typography variant="h6" sx={{ flexGrow: 1 }}>
//           SRB Bank
//         </Typography>
//         <Button color="inherit" component={Link} to="/login">
//           Login
//         </Button>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;



import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { onAuthStateChanged, signOut } from "firebase/auth"; // Import functions

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check user authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login", { replace: true }); // Redirect to login page
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed, please try again.");
    }
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SRB Bank
        </Typography>

        {user ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
