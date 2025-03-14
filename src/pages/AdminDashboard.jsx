import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: "100vh", padding: 4, backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="sm">
        <Typography variant="h4" textAlign="center" gutterBottom>
          Admin Dashboard - SRB Bank
        </Typography>

        <Paper sx={{ padding: 4, textAlign: "center", borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>Select an action:</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ m: 1, width: "100%" }} 
            onClick={() => navigate("/loan-approvals")}
          >
            Manage Loan Applications
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            sx={{ m: 1, width: "100%" }} 
            onClick={() => navigate("/bank-approvals")}
          >
            Manage Bank Accounts
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
