import { Box, Typography, Grid, Card, CardMedia, CardContent } from "@mui/material";
import { useEffect, useState } from "react";
import { authFetch } from "../api/api";
import MovieCard from "../components/MovieCard";


export default function History() {

    const [history, setHistory] = useState([]);


    useEffect(() => {
        authFetch("http://localhost:8080/api/history")
            .then(res => res.json())
            .then(data => {
                console.log("HISTORY DATA:", data);
                setHistory(data);
            })
            .catch(err => console.error(err));
    }, []);


    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Recently Watched
            </Typography>

            {history.length === 0 ? (
                <Typography>
                    No watch history yet. Watch a movie to see it here 🎬
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {history.map((movie) => (
                        <Grid item key={movie.id}>
                            <MovieCard movie={{
                                id: movie.movieId,
                                title: movie.title,
                                posterUrl: movie.posterUrl
                                }} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
