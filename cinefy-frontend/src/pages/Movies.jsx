import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import MovieCard from "../components/MovieCard";
import { authFetch } from "../api/api";

export default function Movies() {
  const location = useLocation();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get search query from URL
  const query = new URLSearchParams(location.search);
  const search = query.get("search")?.toLowerCase() || "";

  useEffect(() => {
    const fetchMovies = async () => {
        try {
        const res = await authFetch("http://localhost:8080/api/movies");

        if (!res.ok) {
            throw new Error("Failed to fetch movies");
        }

        const data = await res.json();
        setMovies(data);
        } catch (err) {
        setError("Unable to load movies");
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchMovies();
  }, []);

  // Filter movies based on search
  const filteredMovies = movies.filter((movie) =>
    movie.title?.toLowerCase().includes(search)
  );

  if (loading) {
    return (
      <Box p={4}>
        <Typography>Loading movies...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {search ? `Search Results for "${search}"` : "All Movies"}
      </Typography>

      {filteredMovies.length === 0 ? (
        <Typography>No movies found</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredMovies.map((movie) => (
            <Grid item key={movie.id}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
