// import { useEffect, useState } from "react";
// import {
//   Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Button, Container
// } from "@mui/material";
// import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { useNavigate } from "react-router-dom";

// const LoanApprovals = () => {
//   const [loanApplications, setLoanApplications] = useState([]);
//   const [loading, setLoading] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const loanSnapshot = await getDocs(collection(db, "loan_application"));
//         setLoanApplications(loanSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
//       } catch (error) {
//         console.error("Error fetching loans:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleLoanStatus = async (id, status, loan) => {
//     setLoading((prev) => ({ ...prev, [id]: true }));

//     try {
//       // Update loan status in Firestore
//       await updateDoc(doc(db, "loan_application", id), { loan_status: status });

//       // If approved, update bank account balance
//       if (status === "approved") {
//         const accountNumber = loan.account_number; // Get account number from loan data
//         const bankDocRef = doc(db, "bank_account", accountNumber); // Bank account doc ID is account_number

//         // Fetch the bank account data
//         const bankSnapshot = await getDocs(collection(db, "bank_account"));
//         const bankDoc = bankSnapshot.docs.find(doc => doc.id === accountNumber);

//         if (bankDoc) {
//           const accountData = bankDoc.data();
//           const newBalance = (accountData.acct_balance || 0) + loan.loan_amt;

//           await updateDoc(bankDocRef, { acct_balance: newBalance });
//           alert(`Loan approved and balance updated!`);
//         } else {
//           alert("Error: Bank account not found for this account number.");
//         }
//       } else {
//         alert(`Loan status updated to ${status}`);
//       }

//       // Update local state to reflect changes
//       setLoanApplications((prev) =>
//         prev.map((loan) =>
//           loan.id === id ? { ...loan, loan_status: status } : loan
//         ).filter(loan => loan.loan_status === "request" || loan.loan_status === "onhold")
//       );

//     } catch (error) {
//       console.error("Error updating loan:", error);
//       alert("Error processing loan. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, [id]: false }));
//     }
//   };

  


//   return (
//     <Box sx={{ minHeight: "100vh", padding: 4, backgroundColor: "#f5f5f5" }}>
//       <Container maxWidth="lg">
//         <Typography variant="h4" textAlign="center" gutterBottom>
//           Loan Applications
//         </Typography>

//         <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate("/admin-dashboard")}>
//           🔙 Back to Dashboard
//         </Button>

//         {/* REQUEST SECTION */}
//         <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
//           Loan Requests
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Application ID</b></TableCell>
//                 <TableCell><b>Loan Type</b></TableCell>
//                 <TableCell><b>Account Number</b></TableCell>
//                 <TableCell><b>Loan Amount</b></TableCell>
//                 <TableCell><b>Interest</b></TableCell>
//                 <TableCell><b>Term</b></TableCell>
//                 <TableCell><b>Status</b></TableCell>
//                 <TableCell><b>Actions</b></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loanApplications.filter(loan => loan.loan_status === "request").map((loan) => (
//                 <TableRow key={loan.id}>
//                   <TableCell>{loan.appl_id}</TableCell>
//                   <TableCell>{loan.loan_type}</TableCell>
//                   <TableCell>{loan.account_number}</TableCell>
//                   <TableCell>{loan.loan_amt}</TableCell>
//                   <TableCell>{loan.loan_interest}%</TableCell>
//                   <TableCell>{loan.loan_term} years</TableCell>
//                   <TableCell>{loan.loan_status}</TableCell>
//                   <TableCell>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "approved", loan)}
//                       color="success"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Approve"}
//                     </Button>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "onhold", loan)}
//                       color="warning"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Hold"}
//                     </Button>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "rejected", loan)}
//                       color="error"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Reject"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {/* ON HOLD SECTION */}
//         <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
//           On Hold Loans
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Application ID</b></TableCell>
//                 <TableCell><b>Loan Type</b></TableCell>
//                 <TableCell><b>Account Number</b></TableCell>
//                 <TableCell><b>Loan Amount</b></TableCell>
//                 <TableCell><b>Interest</b></TableCell>
//                 <TableCell><b>Term</b></TableCell>
//                 <TableCell><b>Status</b></TableCell>
//                 <TableCell><b>Actions</b></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loanApplications.filter(loan => loan.loan_status === "onhold").map((loan) => (
//                 <TableRow key={loan.id}>
//                   <TableCell>{loan.appl_id}</TableCell>
//                   <TableCell>{loan.loan_type}</TableCell>
//                   <TableCell>{loan.account_number}</TableCell>
//                   <TableCell>{loan.loan_amt}</TableCell>
//                   <TableCell>{loan.loan_interest}%</TableCell>
//                   <TableCell>{loan.loan_term} years</TableCell>
//                   <TableCell>{loan.loan_status}</TableCell>
//                   <TableCell>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "approved", loan)}
//                       color="success"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Approve"}
//                     </Button>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "rejected", loan)}
//                       color="error"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Reject"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Container>
//     </Box>
//   );
// };

// export default LoanApprovals;












// import { useEffect, useState } from "react";
// import {
//   Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   Paper, Button, Container
// } from "@mui/material";
// import { collection, getDocs, updateDoc, doc, getDoc } from "firebase/firestore";
// import { db } from "../firebaseConfig";
// import { useNavigate } from "react-router-dom";

// const LoanApprovals = () => {
//   const [loanApplications, setLoanApplications] = useState([]);
//   const [loading, setLoading] = useState({});
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const loanSnapshot = await getDocs(collection(db, "loan_application"));
//         setLoanApplications(
//           loanSnapshot.docs.map((doc) => ({
//             id: doc.id,
//             ...doc.data(),
//             account_number: Number(doc.data().account_number) || 0, // Ensure account number is a number
//           }))
//         );
//       } catch (error) {
//         console.error("Error fetching loans:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleLoanStatus = async (id, status, loan) => {
//     setLoading((prev) => ({ ...prev, [id]: true }));

//     try {
//       // Update loan status in Firestore
//       await updateDoc(doc(db, "loan_application", id), { loan_status: status });

//       // If approved, update bank account balance
//       if (status === "approved") {
//         const accountNumber = loan.account_number;
//         const bankDocRef = doc(db, "bank_account", accountNumber.toString()); // Convert number to string for Firestore lookup

//         // Fetch the bank account document
//         const bankSnapshot = await getDoc(bankDocRef);

//         if (bankSnapshot.exists()) {
//           const accountData = bankSnapshot.data();
//           const newBalance = (accountData.acct_balance || 0) + loan.loan_amt;

//           await updateDoc(bankDocRef, { acct_balance: newBalance });
//           alert(`Loan approved and balance updated!`);
//         } else {
//           alert("Error: Bank account not found for this account number.");
//         }
//       } else {
//         alert(`Loan status updated to ${status}`);
//       }

//       // Update local state to reflect changes
//       setLoanApplications((prev) =>
//         prev.map((loan) =>
//           loan.id === id ? { ...loan, loan_status: status } : loan
//         ).filter(loan => loan.loan_status === "request" || loan.loan_status === "onhold")
//       );

//     } catch (error) {
//       console.error("Error updating loan:", error);
//       alert("Error processing loan. Please try again.");
//     } finally {
//       setLoading((prev) => ({ ...prev, [id]: false }));
//     }
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", padding: 4, backgroundColor: "#f5f5f5" }}>
//       <Container maxWidth="lg">
//         <Typography variant="h4" textAlign="center" gutterBottom>
//           Loan Applications
//         </Typography>

//         <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate("/admin-dashboard")}>
//           🔙 Back to Dashboard
//         </Button>

//         {/* REQUEST SECTION */}
//         <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
//           Loan Requests
//         </Typography>
//         <TableContainer component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow>
//                 <TableCell><b>Application ID</b></TableCell>
//                 <TableCell><b>Loan Type</b></TableCell>
//                 <TableCell><b>Account Number</b></TableCell>
//                 <TableCell><b>Loan Amount</b></TableCell>
//                 <TableCell><b>Interest</b></TableCell>
//                 <TableCell><b>Term</b></TableCell>
//                 <TableCell><b>Status</b></TableCell>
//                 <TableCell><b>Actions</b></TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {loanApplications.filter(loan => loan.loan_status === "request").map((loan) => (
//                 <TableRow key={loan.id}>
//                   <TableCell>{loan.appl_id}</TableCell>
//                   <TableCell>{loan.loan_type}</TableCell>
//                   <TableCell>{loan.account_number ?? "N/A"}</TableCell>
//                   <TableCell>{loan.loan_amt}</TableCell>
//                   <TableCell>{loan.loan_interest}%</TableCell>
//                   <TableCell>{loan.loan_term} years</TableCell>
//                   <TableCell>{loan.loan_status}</TableCell>
//                   <TableCell>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "approved", loan)}
//                       color="success"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Approve"}
//                     </Button>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "onhold", loan)}
//                       color="warning"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Hold"}
//                     </Button>
//                     <Button
//                       onClick={() => handleLoanStatus(loan.id, "rejected", loan)}
//                       color="error"
//                       disabled={loading[loan.id]}
//                     >
//                       {loading[loan.id] ? "Processing..." : "Reject"}
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

        // {/* ON HOLD SECTION */}
        // <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        //   On Hold Loans
        // </Typography>
        // <TableContainer component={Paper}>
        //   <Table>
        //     <TableHead>
        //       <TableRow>
        //         <TableCell><b>Application ID</b></TableCell>
        //         <TableCell><b>Loan Type</b></TableCell>
        //         <TableCell><b>Account Number</b></TableCell>
        //         <TableCell><b>Loan Amount</b></TableCell>
        //         <TableCell><b>Interest</b></TableCell>
        //         <TableCell><b>Term</b></TableCell>
        //         <TableCell><b>Status</b></TableCell>
        //         <TableCell><b>Actions</b></TableCell>
        //       </TableRow>
        //     </TableHead>
        //     <TableBody>
        //       {loanApplications.filter(loan => loan.loan_status === "onhold").map((loan) => (
        //         <TableRow key={loan.id}>
        //           <TableCell>{loan.appl_id}</TableCell>
        //           <TableCell>{loan.loan_type}</TableCell>
        //           <TableCell>{loan.account_number ?? "N/A"}</TableCell>
        //           <TableCell>{loan.loan_amt}</TableCell>
        //           <TableCell>{loan.loan_interest}%</TableCell>
        //           <TableCell>{loan.loan_term} years</TableCell>
        //           <TableCell>{loan.loan_status}</TableCell>
        //           <TableCell>
        //             <Button
        //               onClick={() => handleLoanStatus(loan.id, "approved", loan)}
        //               color="success"
        //               disabled={loading[loan.id]}
        //             >
        //               {loading[loan.id] ? "Processing..." : "Approve"}
        //             </Button>
        //             <Button
        //               onClick={() => handleLoanStatus(loan.id, "rejected", loan)}
        //               color="error"
        //               disabled={loading[loan.id]}
        //             >
        //               {loading[loan.id] ? "Processing..." : "Reject"}
        //             </Button>
        //           </TableCell>
        //         </TableRow>
        //       ))}
        //     </TableBody>
        //   </Table>
        // </TableContainer>
//       </Container>
//     </Box>
//   );
// };

// export default LoanApprovals;

import { useEffect, useState } from "react";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Container
} from "@mui/material";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const LoanApprovals = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [bankAccounts, setBankAccounts] = useState({});
  const [loading, setLoading] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch loan applications
        const loanSnapshot = await getDocs(collection(db, "loan_application"));
        const loanData = loanSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          account_number: doc.data().acct_number?.toString() || "N/A", // Convert to string
        }));

        console.log("Loan Data:", loanData);

        // Fetch bank accounts
        const bankSnapshot = await getDocs(collection(db, "bank_account"));
        const bankData = {};
        bankSnapshot.docs.forEach((doc) => {
          bankData[doc.data().acct_number?.toString()] = { 
            ...doc.data(), 
            id: doc.id 
          }; // Store by string acct_number
        });

        console.log("Bank Accounts Data:", bankData);

        setLoanApplications(loanData);
        setBankAccounts(bankData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleLoanStatus = async (id, status, loan) => {
    setLoading((prev) => ({ ...prev, [id]: true }));

    try {
      // Update loan status in Firestore
      await updateDoc(doc(db, "loan_application", id), { loan_status: status });

      // If approved, update bank account balance
      if (status === "approved") {
        const accountNumber = loan.account_number.toString(); // Ensure it's string
        console.log("Processing loan for account:", accountNumber);

        // Find matching bank account
        const matchingBankAccount = bankAccounts[accountNumber];

        if (!matchingBankAccount) {
          alert("Error: Bank account not found.");
          return;
        }

        const bankDocRef = doc(db, "bank_account", matchingBankAccount.id); // Use Firestore doc ID
        const newBalance = (matchingBankAccount.acct_balance || 0) + loan.loan_amt;

        console.log(`Updating bank account ${matchingBankAccount.id} with new balance: ${newBalance}`);

        await updateDoc(bankDocRef, { acct_balance: newBalance });
        alert("Loan approved and balance updated!");

        // Update local bankAccounts state
        setBankAccounts((prev) => ({
          ...prev,
          [accountNumber]: { ...prev[accountNumber], acct_balance: newBalance },
        }));
      } else {
        alert(`Loan status updated to ${status}`);
      }

      // Update local loanApplications state
      setLoanApplications((prev) =>
        prev.map((loan) =>
          loan.id === id ? { ...loan, loan_status: status } : loan
        ).filter(loan => loan.loan_status === "request" || loan.loan_status === "onhold")
      );

    } catch (error) {
      console.error("Error updating loan:", error);
      alert("Error processing loan. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", padding: 4, backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" textAlign="center" gutterBottom>
          Loan Applications
        </Typography>

        <Button variant="contained" sx={{ mb: 2 }} onClick={() => navigate("/admin-dashboard")}>
          🔙 Back to Dashboard
        </Button>

        {/* REQUEST SECTION */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          Loan Requests
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Application ID</b></TableCell>
                <TableCell><b>Loan Type</b></TableCell>
                <TableCell><b>Account Number</b></TableCell>
                <TableCell><b>Loan Amount</b></TableCell>
                <TableCell><b>Interest</b></TableCell>
                <TableCell><b>Term</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanApplications.filter(loan => loan.loan_status === "request").map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.appl_id}</TableCell>
                  <TableCell>{loan.loan_type}</TableCell>
                  <TableCell>{loan.account_number || "N/A"}</TableCell>
                  <TableCell>{loan.loan_amt}</TableCell>
                  <TableCell>{loan.loan_interest}%</TableCell>
                  <TableCell>{loan.loan_term} years</TableCell>
                  <TableCell>{loan.loan_status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleLoanStatus(loan.id, "approved", loan)} color="success" disabled={loading[loan.id]}>
                      {loading[loan.id] ? "Processing..." : "Approve"}
                    </Button>
                    <Button onClick={() => handleLoanStatus(loan.id, "onhold", loan)} color="warning" disabled={loading[loan.id]}>
                      {loading[loan.id] ? "Processing..." : "Hold"}
                    </Button>
                    <Button onClick={() => handleLoanStatus(loan.id, "rejected", loan)} color="error" disabled={loading[loan.id]}>
                      {loading[loan.id] ? "Processing..." : "Reject"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ON HOLD SECTION */}
        <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
          On Hold Loans
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Application ID</b></TableCell>
                <TableCell><b>Loan Type</b></TableCell>
                <TableCell><b>Account Number</b></TableCell>
                <TableCell><b>Loan Amount</b></TableCell>
                <TableCell><b>Interest</b></TableCell>
                <TableCell><b>Term</b></TableCell>
                <TableCell><b>Status</b></TableCell>
                <TableCell><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanApplications.filter(loan => loan.loan_status === "onhold").map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.appl_id}</TableCell>
                  <TableCell>{loan.loan_type}</TableCell>
                  <TableCell>{loan.account_number ?? "N/A"}</TableCell>
                  <TableCell>{loan.loan_amt}</TableCell>
                  <TableCell>{loan.loan_interest}%</TableCell>
                  <TableCell>{loan.loan_term} years</TableCell>
                  <TableCell>{loan.loan_status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleLoanStatus(loan.id, "approved", loan)}
                      color="success"
                      disabled={loading[loan.id]}
                    >
                      {loading[loan.id] ? "Processing..." : "Approve"}
                    </Button>
                    <Button
                      onClick={() => handleLoanStatus(loan.id, "rejected", loan)}
                      color="error"
                      disabled={loading[loan.id]}
                    >
                      {loading[loan.id] ? "Processing..." : "Reject"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      </Container>
    </Box>
  );
};

export default LoanApprovals;
