// import { useEffect, useState } from "react";
// import {
//   Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Button, TextField, Container, Dialog, DialogActions, DialogContent,
//   DialogTitle
// } from "@mui/material";
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { useNavigate } from "react-router-dom";

// const BankAccountApprovals = () => {
//   const [bankAccounts, setBankAccounts] = useState([]);
//   const [loading, setLoading] = useState({});
//   const [openLimitDialog, setOpenLimitDialog] = useState(false);
//   const [selectedAccount, setSelectedAccount] = useState(null);
//   const [newLimit, setNewLimit] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const accountSnapshot = await getDocs(collection(db, "bank_account"));
//         setBankAccounts(accountSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       } catch (error) {
//         console.error("Error fetching bank accounts:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAccountStatus = async (id, status) => {
//     setLoading((prev) => ({ ...prev, [id]: true }));

//     try {
//       if (status === "approved") {
//         // Ensure the limit is set before approving
//         if (!newLimit || isNaN(newLimit) || Number(newLimit) <= 0) {
//           alert("Please set a valid account limit before approving.");
//           setLoading((prev) => ({ ...prev, [id]: false }));
//           return;
//         }

//         await updateDoc(doc(db, "bank_account", id), {
//           acct_status: status,
//           acct_limit: Number(newLimit),
//         });

//         alert("Bank account approved successfully!");
//       } else {
//         await updateDoc(doc(db, "bank_account", id), { acct_status: status });
//       }

//       // Update local state to reflect changes
//       setBankAccounts((prev) =>
//         prev.map((account) =>
//           account.id === id ? { ...account, acct_status: status, acct_limit: status === "approved" ? Number(newLimit) : account.acct_limit } : account
//         ).filter(account => account.acct_status === "request" || account.acct_status === "onhold")
//       );
//     } catch (error) {
//       console.error("Error updating account:", error);
//       alert("Error processing account. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, [id]: false }));
//       setOpenLimitDialog(false);
//     }
//   };

//   const openLimitModal = (account) => {
//     setSelectedAccount(account);
//     setOpenLimitDialog(true);
//     setNewLimit("");
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", padding: 4, backgroundColor: "#f5f5f5" }}>
//       <Container maxWidth="lg">
//         <Typography variant="h4" textAlign="center" gutterBottom>
//           Bank Account Approvals
//         </Typography>

//         <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate("/admin-dashboard")}>
//           🔙 Back to Dashboard
//         </Button>

//         {/* REQUEST SECTION */}
//         <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
//           Account Requests
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Account Number</b></TableCell>
//                 <TableCell><b>Customer ID</b></TableCell>
//                 <TableCell><b>Account Type</b></TableCell>
//                 <TableCell><b>Account Status</b></TableCell>
//                 <TableCell><b>Actions</b></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bankAccounts.filter(account => account.acct_status === "request").map((account) => (
//                 <TableRow key={account.id}>
//                   <TableCell>{account.acct_number}</TableCell>
//                   <TableCell>{account.customer_id}</TableCell>
//                   <TableCell>{account.acct_type}</TableCell>
//                   <TableCell>{account.acct_status}</TableCell>
//                   <TableCell>
//                     <Button
//                       onClick={() => openLimitModal(account)}
//                       color="success"
//                       disabled={loading[account.id]}
//                     >
//                       {loading[account.id] ? "Processing..." : "Approve"}
//                     </Button>
//                     <Button
//                       onClick={() => handleAccountStatus(account.id, "onhold")}
//                       color="warning"
//                       disabled={loading[account.id]}
//                     >
//                       {loading[account.id] ? "Processing..." : "Hold"}
//                     </Button>
//                     <Button
//                       onClick={() => handleAccountStatus(account.id, "rejected")}
//                       color="error"
//                       disabled={loading[account.id]}
//                     >
//                       {loading[account.id] ? "Processing..." : "Reject"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* ON HOLD SECTION */}
//         <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
//           On Hold Accounts
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Account Number</b></TableCell>
//                 <TableCell><b>Customer ID</b></TableCell>
//                 <TableCell><b>Account Type</b></TableCell>
//                 <TableCell><b>Account Status</b></TableCell>
//                 <TableCell><b>Actions</b></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {bankAccounts.filter(account => account.acct_status === "onhold").map((account) => (
//                 <TableRow key={account.id}>
//                   <TableCell>{account.acct_number}</TableCell>
//                   <TableCell>{account.customer_id}</TableCell>
//                   <TableCell>{account.acct_type}</TableCell>
//                   <TableCell>{account.acct_status}</TableCell>
//                   <TableCell>
//                     <Button
//                       onClick={() => openLimitModal(account)}
//                       color="success"
//                       disabled={loading[account.id]}
//                     >
//                       {loading[account.id] ? "Processing..." : "Approve"}
//                     </Button>
//                     <Button
//                       onClick={() => handleAccountStatus(account.id, "rejected")}
//                       color="error"
//                       disabled={loading[account.id]}
//                     >
//                       {loading[account.id] ? "Processing..." : "Reject"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Container>

//       {/* LIMIT SETTING MODAL */}
//       <Dialog open={openLimitDialog} onClose={() => setOpenLimitDialog(false)}>
//         <DialogTitle>Set Account Limit</DialogTitle>
//         <DialogContent>
//           <Typography>Please enter the account limit before approving:</Typography>
//           <TextField
//             autoFocus
//             margin="dense"
//             label="Account Limit"
//             type="number"
//             fullWidth
//             value={newLimit}
//             onChange={(e) => setNewLimit(e.target.value)}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenLimitDialog(false)} color="secondary">Cancel</Button>
//           <Button onClick={() => handleAccountStatus(selectedAccount.id, "approved")} color="success">
//             Approve
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default BankAccountApprovals;

import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, TextField, Container, Dialog, DialogActions, DialogContent,
  DialogTitle
} from "@mui/material";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const BankAccountApprovals = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [loading, setLoading] = useState({});
  const [openLimitDialog, setOpenLimitDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [newLimit, setNewLimit] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountSnapshot = await getDocs(collection(db, "bank_account"));
        setBankAccounts(accountSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching bank accounts:", error);
      }
    };

    fetchData();
  }, []);

  const handleAccountStatus = async (id, status) => {
    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      if (status === "approved") {
        if (!newLimit || isNaN(newLimit) || Number(newLimit) <= 0) {
          alert("Please set a valid account limit before approving.");
          setLoading((prev) => ({ ...prev, [id]: false }));
          return;
        }

        await updateDoc(doc(db, "bank_account", id), {
          acct_status: status,
          acct_limit: Number(newLimit),
        });

        alert("Bank account approved successfully!");
      } else {
        await updateDoc(doc(db, "bank_account", id), { acct_status: status });
      }

      // Remove rejected accounts, keep only request and onhold
      setBankAccounts((prev) =>
        prev
          .map((account) =>
            account.id === id
              ? { ...account, acct_status: status, acct_limit: status === "approved" ? Number(newLimit) : account.acct_limit }
              : account
          )
          .filter(account => account.acct_status === "request" || account.acct_status === "onhold")
      );
    } catch (error) {
      console.error("Error updating account:", error);
      alert("Error processing account. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
      setOpenLimitDialog(false);
    }
  };

  const openLimitModal = (account) => {
    setSelectedAccount(account);
    setOpenLimitDialog(true);
    setNewLimit("");
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: 4, backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" textAlign="center" gutterBottom>
          Bank Account Approvals
        </Typography>

        <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate("/admin-dashboard")}>
          🔙 Back to Dashboard
        </Button>

        {/* REQUEST SECTION */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Account Requests
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>User ID</b></TableCell>
                <TableCell><b>User Name</b></TableCell>
                <TableCell><b>User Adhar</b></TableCell>
                <TableCell><b>User PAN</b></TableCell>
                <TableCell><b>Account Number</b></TableCell>
                <TableCell><b>Account Type</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankAccounts.filter(account => account.acct_status === "request").map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.userid}</TableCell>
                  <TableCell>{account.user_name}</TableCell>
                  <TableCell>{account.user_adhar}</TableCell>
                  <TableCell>{account.user_pan}</TableCell>
                  <TableCell>{account.acct_number}</TableCell>
                  <TableCell>{account.acct_type}</TableCell>
                  <TableCell>
                    <Button onClick={() => openLimitModal(account)} color="success" disabled={loading[account.id]}>
                      {loading[account.id] ? "Processing..." : "Approve"}
                    </Button>
                    <Button onClick={() => handleAccountStatus(account.id, "onhold")} color="warning" disabled={loading[account.id]}>
                      {loading[account.id] ? "Processing..." : "Hold"}
                    </Button>
                    <Button onClick={() => handleAccountStatus(account.id, "rejected")} color="error" disabled={loading[account.id]}>
                      {loading[account.id] ? "Processing..." : "Reject"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ON HOLD SECTION */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          On Hold Accounts
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>User ID</b></TableCell>
                <TableCell><b>User Name</b></TableCell>
                <TableCell><b>User Adhar</b></TableCell>
                <TableCell><b>User PAN</b></TableCell>
                <TableCell><b>Account Number</b></TableCell>
                <TableCell><b>Account Type</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bankAccounts.filter(account => account.acct_status === "onhold").map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.user_id}</TableCell>
                  <TableCell>{account.user_name}</TableCell>
                  <TableCell>{account.user_adhar}</TableCell>
                  <TableCell>{account.user_pan}</TableCell>
                  <TableCell>{account.acct_number}</TableCell>
                  <TableCell>{account.acct_type}</TableCell>
                  <TableCell>
                    <Button onClick={() => openLimitModal(account)} color="success" disabled={loading[account.id]}>
                      {loading[account.id] ? "Processing..." : "Approve"}
                    </Button>
                    <Button onClick={() => handleAccountStatus(account.id, "rejected")} color="error" disabled={loading[account.id]}>
                      {loading[account.id] ? "Processing..." : "Reject"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* LIMIT SETTING MODAL */}
        <Dialog open={openLimitDialog} onClose={() => setOpenLimitDialog(false)}>
          <DialogTitle>Set Account Limit</DialogTitle>
          <DialogContent>
            <Typography>Please enter the account limit before approving:</Typography>
            <TextField
              autoFocus
              margin="dense"
              label="Account Limit"
              type="number"
              fullWidth
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenLimitDialog(false)} color="secondary">Cancel</Button>
            <Button onClick={() => handleAccountStatus(selectedAccount.id, "approved")} color="success">
              Approve
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default BankAccountApprovals;
