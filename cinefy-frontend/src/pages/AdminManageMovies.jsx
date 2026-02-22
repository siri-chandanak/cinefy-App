import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress
} from "@mui/material";
import { authFetch } from "../api/api";

const API_BASE = "http://localhost:8080";

export default function AdminDeleteMovies() {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMovies = async () => {
    try {
      const res = await authFetch(`${API_BASE}/api/admin/movies`);
      if (!res.ok) throw new Error("Failed to load movies");
      const data = await res.json();
      setMovies(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleDelete = async (movieId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmDelete) return;

    try {
      const res = await authFetch(`${API_BASE}/api/admin/movies/${movieId}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Delete failed");

      setMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete movie");
    }
  };

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mt={4} boxShadow={2} borderRadius={2} overflow="hidden">
        <Typography variant="h4" gutterBottom>
          Delete Movies (Admin Only)
        </Typography>

        <Table bgcolor="white">
          <TableHead>
            <TableRow>
              <TableCell><b>Title</b></TableCell>
              <TableCell><b>Year</b></TableCell>
              <TableCell><b>Language</b></TableCell>
              <TableCell><b>Duration</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {movies.map(movie => (
              <TableRow key={movie.id}>
                 <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.releaseYear}</TableCell>
                <TableCell>{movie.language}</TableCell>
                <TableCell>{movie.durationMin} min</TableCell>
                
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {movies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  No movies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
