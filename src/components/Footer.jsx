import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ textAlign: "center", p: 2, backgroundColor: "#1976d2", color: "white", mt: 5 }}>
      <Typography variant="body2">
        © 2025 SRB Bank. All Rights Reserved.
      </Typography>
      <Typography variant="body2">
        Contact: support@srb-bank.com | 1800-123-4567
      </Typography>
    </Box>
  );
};

export default Footer;
