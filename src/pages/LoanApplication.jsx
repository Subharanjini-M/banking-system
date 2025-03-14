// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, db, getDoc, doc, addDoc, collection, Timestamp } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { Box, Typography, Container, Button, MenuItem, TextField, Paper, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// const LoanApplication = () => {
//   const [accounts, setAccounts] = useState([]);
//   const [selectedAccount, setSelectedAccount] = useState("");
//   const [loanAmount, setLoanAmount] = useState("");
//   const [loanTerm, setLoanTerm] = useState("");
//   const [loanType, setLoanType] = useState("");
//   const [loanApplications, setLoanApplications] = useState([]);
//   const [userId, setUserId] = useState("");
//   const navigate = useNavigate();

//   // Loan interest rates
//   const interestRates = {
//     business: 5,
//     home: 4,
//     car: 3,
//     personal: 2,
//     education: 1,
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         try {
//           const userRef = doc(db, "customers", user.email);
//           const userSnap = await getDoc(userRef);

//           if (userSnap.exists()) {
//             const userData = userSnap.data();
//             setAccounts(userData.bank_accounts || []);
//             setUserId(userData.user_id);
//             fetchLoanApplications(userData.user_id);
//           } else {
//             console.error("No user data found!");
//           }
//         } catch (error) {
//           console.error("Error fetching user data:", error);
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch loan applications for the user
//   const fetchLoanApplications = async (userId) => {
//     try {
//       const loanRef = collection(db, "loan_application");
//       const loanSnap = await getDoc(doc(loanRef, userId));

//       if (loanSnap.exists()) {
//         setLoanApplications(loanSnap.data().applications || []);
//       }
//     } catch (error) {
//       console.error("Error fetching loan applications:", error);
//     }
//   };

//   // Generate random 5-digit application ID
//   const generateApplicationId = () => Math.floor(10000 + Math.random() * 90000);

//   // Handle loan application submission
//   const applyLoan = async () => {
//     if (!selectedAccount || !loanAmount || !loanTerm || !loanType) {
//       alert("Please fill all fields.");
//       return;
//     }

//     const applicationData = {
//       acct_number: selectedAccount,
//       appl_id: generateApplicationId(),
//       applied_date: Timestamp.now(),
//       loan_amt: Number(loanAmount),
//       loan_interest: interestRates[loanType] || 0,
//       loan_status: "request",
//       loan_term: Number(loanTerm),
//       loan_type: loanType,
//       userid: userId,
//     };

//     try {
//       await addDoc(collection(db, "loan_application"), applicationData);
//       alert("Loan application submitted successfully!");
//       setLoanApplications([...loanApplications, applicationData]); // Update UI
//     } catch (error) {
//       console.error("Error submitting loan application:", error);
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       {/* Loan Application Form */}
//       <Paper sx={{ p: 4, mt: 4, boxShadow: 3, borderRadius: 2 }}>
//         <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center" mb={3}>
//           Apply for a Loan
//         </Typography>

//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Bank Account</InputLabel>
//           <Select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
//             {accounts.map((account) => (
//               <MenuItem key={account} value={account}>
//                 {account}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <TextField
//           fullWidth
//           label="Loan Amount"
//           type="number"
//           value={loanAmount}
//           onChange={(e) => setLoanAmount(e.target.value)}
//           sx={{ mb: 2 }}
//         />

//         <TextField
//           fullWidth
//           label="Loan Term (in years)"
//           type="number"
//           value={loanTerm}
//           onChange={(e) => setLoanTerm(e.target.value)}
//           sx={{ mb: 2 }}
//         />

//         <FormControl fullWidth sx={{ mb: 2 }}>
//           <InputLabel>Loan Type</InputLabel>
//           <Select value={loanType} onChange={(e) => setLoanType(e.target.value)}>
//             {Object.keys(interestRates).map((type) => (
//               <MenuItem key={type} value={type}>
//                 {type.charAt(0).toUpperCase() + type.slice(1)}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button variant="contained" color="primary" fullWidth onClick={applyLoan}>
//           Apply Loan
//         </Button>
//       </Paper>

//       {/* Loan Status Section */}
//       <Paper sx={{ p: 4, mt: 4, boxShadow: 3, borderRadius: 2 }}>
//         <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center" mb={3}>
//           Loan Status
//         </Typography>

//         {loanApplications.length === 0 ? (
//           <Typography textAlign="center">No loan applications found.</Typography>
//         ) : (
//           <TableContainer>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell sx={{ fontWeight: "bold" }}>Application ID</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Account</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Term</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Interest</TableCell>
//                   <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {loanApplications.map((loan) => (
//                   <TableRow key={loan.appl_id}>
//                     <TableCell>{loan.appl_id}</TableCell>
//                     <TableCell>{loan.acct_number}</TableCell>
//                     <TableCell>₹ {loan.loan_amt.toLocaleString()}</TableCell>
//                     <TableCell>{loan.loan_term} yrs</TableCell>
//                     <TableCell>{loan.loan_type}</TableCell>
//                     <TableCell>{loan.loan_interest}%</TableCell>
//                     <TableCell>{loan.loan_status}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}
//       </Paper>

//       <Box textAlign="center" mt={4}>
//         <Button variant="contained" color="secondary" onClick={() => navigate("/user-dashboard")}>
//           Back to Dashboard
//         </Button>
//       </Box>
//     </Container>
//   );
// };

// export default LoanApplication;



import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, getDoc, doc, addDoc, collection, Timestamp, query, where, getDocs } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { Box, Typography, Container, Button, MenuItem, TextField, Paper, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const LoanApplication = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [loanType, setLoanType] = useState("");
  const [loanApplications, setLoanApplications] = useState([]);
  const [userId, setUserId] = useState("");
  const navigate = useNavigate();

  const interestRates = {
    business: 5,
    home: 4,
    car: 3,
    personal: 2,
    education: 1,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "customers", user.email);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setAccounts(userData.bank_accounts || []);
            setUserId(userData.user_id);
            fetchLoanApplications(userData.user_id);
          } else {
            console.error("No user data found!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch all loan applications for the user
  const fetchLoanApplications = async (userId) => {
    try {
      const loanRef = collection(db, "loan_application");
      const q = query(loanRef, where("userid", "==", userId));
      const loanSnap = await getDocs(q);

      const loans = loanSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLoanApplications(loans);
    } catch (error) {
      console.error("Error fetching loan applications:", error);
    }
  };

  const generateApplicationId = () => Math.floor(10000 + Math.random() * 90000);

  const applyLoan = async () => {
    if (!selectedAccount || !loanAmount || !loanTerm || !loanType) {
      alert("Please fill all fields.");
      return;
    }

    const applicationData = {
      acct_number: selectedAccount,
      appl_id: generateApplicationId(),
      applied_date: Timestamp.now(),
      loan_amt: Number(loanAmount),
      loan_interest: interestRates[loanType] || 0,
      loan_status: "request",
      loan_term: Number(loanTerm),
      loan_type: loanType,
      userid: userId,
    };

    try {
      await addDoc(collection(db, "loan_application"), applicationData);
      alert("Loan application submitted successfully!");
      setLoanApplications([...loanApplications, applicationData]); // Update UI
    } catch (error) {
      console.error("Error submitting loan application:", error);
    }
  };

  return (
    <Container maxWidth="md">
      {/* Loan Application Form */}
      <Paper sx={{ p: 4, mt: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center" mb={3}>
          Apply for a Loan
        </Typography>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Bank Account</InputLabel>
          <Select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
            {accounts.map((account) => (
              <MenuItem key={account} value={account}>
                {account}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Loan Amount"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Loan Term (in years)"
          type="number"
          value={loanTerm}
          onChange={(e) => setLoanTerm(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Loan Type</InputLabel>
          <Select value={loanType} onChange={(e) => setLoanType(e.target.value)}>
            {Object.keys(interestRates).map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" color="primary" fullWidth onClick={applyLoan}>
          Apply Loan
        </Button>
      </Paper>

      {/* Loan Status Section - Shows ALL loans */}
      <Paper sx={{ p: 4, mt: 4, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="primary" textAlign="center" mb={3}>
          Loan History
        </Typography>

        {loanApplications.length === 0 ? (
          <Typography textAlign="center">No loan applications found.</Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>Application ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Account</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Term</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Interest</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loanApplications.map((loan) => (
                  <TableRow key={loan.appl_id}>
                    <TableCell>{loan.appl_id}</TableCell>
                    <TableCell>{loan.acct_number}</TableCell>
                    <TableCell>₹ {loan.loan_amt.toLocaleString()}</TableCell>
                    <TableCell>{loan.loan_term} yrs</TableCell>
                    <TableCell>{loan.loan_type}</TableCell>
                    <TableCell>{loan.loan_interest}%</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color:
                          loan.loan_status === "approved"
                            ? "green"
                            : loan.loan_status === "rejected"
                            ? "red"
                            : "orange",
                      }}
                    >
                      {loan.loan_status.charAt(0).toUpperCase() + loan.loan_status.slice(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      <Box textAlign="center" mt={4}>
        <Button variant="contained" color="secondary" onClick={() => navigate("/user-dashboard")}>
          Back to Dashboard
        </Button>
      </Box>
    </Container>
  );
};

export default LoanApplication;
