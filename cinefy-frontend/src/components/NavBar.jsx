import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useState } from "react";
import { AppBar, Toolbar, Typography, InputBase, Button, Box } from "@mui/material";
import { getUserRole } from "../api/getUserRole";


function NavBar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const role = getUserRole();

  const isLoggedIn = !!localStorage.getItem("token");

  const handleSearch = () => {
    const q = search.trim();
    if (q) {
      navigate(`/movies?search=${encodeURIComponent(q)}`);
      setSearch("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload(); // reset app state
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#111" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

        {/* LOGO */}
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          <Link
            to={isLoggedIn ? "/dashboard" : "/"}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            🎞️ Cinefy
          </Link>
        </Typography>

        {/* SEARCH — only after login */}
        {isLoggedIn && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InputBase
              placeholder="Search movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyPress}
              sx={{
                background: "#222",
                color: "#fff",
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                width: 260
              }}
            />
          </Box>
        )}

        {/* NAV LINKS */}
        <Box sx={{ display: "flex", gap: 3 }}>

          {/* AFTER LOGIN */}
          {isLoggedIn && (
            <>
              <Link to="/dashboard" style={{ color: "#ddd", textDecoration: "none" }}>
                Dashboard
              </Link>

              <Link to="/movies" style={{ color: "#ddd", textDecoration: "none" }}>
                Movies
              </Link>

              <Link to="/recommend" style={{ color: "#ddd", textDecoration: "none" }}>
                Recommendations
              </Link>

              <Link to="/history" style={{ color: "#ddd", textDecoration: "none" }}>
                History
              </Link>

              <Link to="/profile" style={{ color: "#ddd", textDecoration: "none" }}>
                Profile
              </Link>

              {/* ADMIN ONLY */}
                {role === "ADMIN" && (
                <>
                    <Link
                    to="/admin/add"
                    style={{ color: "#4caf50", textDecoration: "none", fontWeight: 600 }}
                    >
                    ➕ Add Movie
                    </Link>

                    <Link
                    to="/admin/manage-movies"
                    style={{ color: "#ff9800", textDecoration: "none", fontWeight: 600 }}
                    >
                    🛠 Manage Movies
                    </Link>
                </>
                )}


              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}

          {/* BEFORE LOGIN */}
          {!isLoggedIn && (
            <>
              <Link to="/login" style={{ color: "#ddd", textDecoration: "none" }}>
                Login
              </Link>

              <Link to="/register" style={{ color: "#ddd", textDecoration: "none" }}>
                Register
              </Link>
            </>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
