import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#111",
        color: "#aaa",
        textAlign: "center",
        py: 2,
        mt: "auto"
      }}
    >
      <Typography variant="body2">
        © {new Date().getFullYear()} Cinefy — Movie Recommendation Platform
      </Typography>
    </Box>
  );
}
