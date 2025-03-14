import { Box, Container, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        backgroundImage: "url('/src/assets/bg-bank.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth="md" // 👈 Ensures it takes a good portion of the screen
        sx={{
          textAlign: "center",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          p: { xs: 3, md: 5 }, // 👈 Responsive padding (small for mobile, larger for laptop)
          borderRadius: 3,
        }}
      >
        <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }} gutterBottom>
          Welcome to SRB Bank
        </Typography>
        <Typography variant="h6" sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }} gutterBottom>
          Secure, Reliable, and Banking at Your Fingertips
        </Typography>
        <Button variant="contained" color="secondary" component={Link} to="/login" sx={{ fontSize: { xs: "1rem", md: "1.2rem" }, p: { xs: 1, md: 2 } }}>
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
