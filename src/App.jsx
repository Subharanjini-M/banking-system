import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, Container } from "@mui/material";
import { Suspense, lazy } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SavingsAccount from "./pages/SavingsAccount";
import CreateAccount from "./pages/CreateAccount";
import CurrentAccount from "./pages/CurrentAccount";
import EditProfile from "./pages/EditProfile";
import LoanApplication from "./pages/LoanApplication";
import TransferMoney from "./pages/TransferMoney";



// Lazy loading for better performance
const Home = lazy(() => import("./pages/Home"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const BankApprovals = lazy(() => import("./pages/BankApprovals"));
const LoanApprovals = lazy(() => import("./pages/LoanApprovals"));
const MutualFunds = lazy(() => import("./pages/MutualFunds"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));


function App() {
  return (
    <Router>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          width: "100vw",
          overflowX: "hidden",
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f8f9fa",
            padding: 3,
            width: "100%",
          }}
        >
          <Container maxWidth="xl">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/loan-approvals" element={<LoanApprovals />} />
                <Route path="/bank-approvals" element={<BankApprovals />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mutual-funds" element={<MutualFunds />} />
                <Route path="/create-account" element={<CreateAccount />} />
                <Route path="/savings-account" element={<SavingsAccount />} />
                <Route path="/current-account" element={<CurrentAccount />} />
                <Route path="/edit-profile" element={<EditProfile/>}/>
                <Route path="/apply-loan" element={<LoanApplication/>}/>
                <Route path="/transfer-money" element={<TransferMoney/>}/>

              </Routes>
            </Suspense>
          </Container>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
