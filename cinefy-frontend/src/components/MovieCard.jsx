import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MovieCard({ movie }){
    const navigate = useNavigate();
    const imageUrl = movie.posterUrl
    ? `http://localhost:8080${movie.posterUrl}`
    : "/placeholder.jpg";

    return(
        <Card
            sx={{ width: 200, cursor: "pointer"}}
            onClick={() => {
                const movieId = movie.id || movie.movieId;
                if (!movieId) {
                    console.error("Missing movie ID", movie);
                    return;
                }
                navigate(`/movies/${movieId}`);
                }}
        >
            <CardMedia
                component="img"
                image={imageUrl}
                alt={movie.title}
                sx={{ height: 300 }}
            />
           
        </Card>
    );
}