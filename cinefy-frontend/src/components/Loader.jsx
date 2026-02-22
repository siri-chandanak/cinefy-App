import { Box, CircularProgress } from "@mui/material";

export default function Loader() {
  return (
    <Box
      height="60vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={60} />
    </Box>
  );
}
