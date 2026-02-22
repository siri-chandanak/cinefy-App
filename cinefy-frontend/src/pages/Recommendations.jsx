import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../api/api";
import MovieCard from "../components/MovieCard";

export default function Recommendations() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        const res = await authFetch(
          "http://localhost:8080/api/recommendations?limit=20"
        );

        if (res.status === 401 || res.status === 403) {
          console.log("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return; // STOP execution
        }

        if (!res.ok) {
          throw new Error("Failed to load recommendations");
        }

        const data = await res.json();
        setMovies(data || []);
      } catch (err) {
        console.error("Recommendation error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [navigate]);


  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Loading recommendations...</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" mt={4} mb={3}>
        Recommended For You
      </Typography>

      {movies.length === 0 ? (
        <Typography>
          No recommendations yet. Watch & like movies to get better suggestions 🎬
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {movies.map((movie) => (
            <Grid item xs={12} sm={6} md={3} key={movie.id}>
              <div onClick={() => navigate(`/movies/${movie.id}`)} style={{ cursor: "pointer" }}>
                <MovieCard movie={movie} />
              </div>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
