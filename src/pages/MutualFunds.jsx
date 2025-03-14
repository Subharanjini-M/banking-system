import { Box, Typography, Paper, Container, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MutualFunds = () => {
  const navigate = useNavigate();

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
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            textAlign: "center",
            borderRadius: 2,
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="primary">
            Mutual Funds Investment
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Currently, there are no stocks available for purchase. Please check back later or contact support for more information.
          </Typography>
          <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => navigate("/user-dashboard")}>
            Back to Dashboard
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default MutualFunds;
