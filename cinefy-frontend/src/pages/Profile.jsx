import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Divider
} from "@mui/material";
import { authFetch } from "../api/api";

function DetailRow({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" mb={1.8}>
      <Typography color="gray">{label}</Typography>
      <Typography fontWeight={500}>{value || "-"}</Typography>
    </Box>
  );
}

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    authFetch("http://localhost:8080/api/users/me")
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error("Profile error:", err));
  }, []);

  if (!user) {
    return (
      <Box p={4}>
        <Typography variant="h5">Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      mt={6}
    >
      <Card
        sx={{
          width: 420,
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          boxShadow: 4
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            width: 90,
            height: 90,
            fontSize: 34,
            bgcolor: "#1976d2",
            mx: "auto",
            mb: 2
          }}
        >
          {user.name?.charAt(0)?.toUpperCase()}
        </Avatar>

        {/* Name */}
        <Typography variant="h5" fontWeight="bold">
          {user.name}
        </Typography>

        {/* Email */}
        <Typography color="gray" mb={2}>
          {user.email}
        </Typography>

        <Divider sx={{ my: 2 }} />

        {/* Personal Details */}
        <Typography
          variant="h6"
          align="left"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Personal Details
        </Typography>

        <DetailRow label="Age" value={user.age} />
        <DetailRow label="Country" value={user.country} />
        <DetailRow label="City" value={user.city} />
        <DetailRow label="Language" value={user.languagePref} />
        <DetailRow
          label="Member Since"
          value={
            user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : "-"
          }
        />
      </Card>
    </Box>
  );
}
