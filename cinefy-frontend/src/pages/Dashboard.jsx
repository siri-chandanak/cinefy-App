import MovieCard from "../components/MovieCard";
import { Box, Typography, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { authFetch } from "../api/api";


export default function Dashboard()
{
    const [recommended, setRecommended] = useState([]);
    const [trending, setTrending] = useState([]);
    const [history, setHistory] = useState([]);
    
    useEffect(() => {
        // Recommended
        authFetch("http://localhost:8080/api/recommendations")
        .then(res => res.json())
        .then(data => setRecommended(data))
        .catch(() => setRecommended([]));

        // Trending
        authFetch("http://localhost:8080/api/movies/trending")
        .then(res => res.json())
        .then(data => setTrending(data))
        .catch(() => setTrending([]));

        // History
        authFetch("http://localhost:8080/api/history")
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(() => setHistory([]));
    }, []);
    
    return (
        <Box p={4}>
        <Typography variant="h4" gutterBottom>
            Welcome 👋
        </Typography>

        {/* Recommended */}
        <Typography variant="h5" mt={3} mb={2}>
            Recommended for You
        </Typography>
        <Grid container spacing={2}>
            {recommended.length === 0 ? (
            <Typography>No recommendations yet</Typography>
            ) : (
            recommended.map((movie) => (
                <Grid item key={movie.id}>
                <MovieCard movie={movie} />
                </Grid>
            ))
            )}
        </Grid>

        {/* Trending */}
        <Typography variant="h5" mt={4} mb={2}>
            Trending Now
        </Typography>
        <Grid container spacing={2}>
            {trending.length === 0 ? (
            <Typography>No trending movies</Typography>
            ) : (
            trending.map((movie) => (
                <Grid item key={movie.id}>
                <MovieCard movie={movie} />
                </Grid>
            ))
            )}
        </Grid>

        {/* History */}
        <Typography variant="h5" mt={4} mb={2}>
            Recently Watched
        </Typography>
        <Grid container spacing={2}>
            {history.length === 0 ? (
            <Typography>No watch history yet</Typography>
            ) : (
            history.map((movie) => (
                <Grid item key={movie.id}>
                <MovieCard movie={movie} />
                </Grid>
            ))
            )}
        </Grid>
        </Box>
    );
}