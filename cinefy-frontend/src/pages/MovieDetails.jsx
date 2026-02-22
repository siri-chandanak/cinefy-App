import { useParams } from "react-router-dom";
import { Box, Typography, Button, Grid } from "@mui/material"; 
import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import { authFetch } from "../api/api";

export default function MovieDetails()
{
    const { id } = useParams();
    const [rating, setRating] = useState(null);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [watched, setWatched] = useState(false);
    const [liked, setLiked] = useState(false);
    const [comment, setComment] = useState("");
    const [reviews, setReviews] = useState([]);


    useEffect(() => {
        if (!id) return;

        setLoading(true);

        Promise.all([
            // Movie details
            authFetch(`http://localhost:8080/api/movies/${id}`).then(r => {
                if (!r.ok) throw new Error("Movie not found");
                return r.json();
            }),

            // Watched status
            authFetch(`http://localhost:8080/api/movies/${id}/watched`)
                .then(r => r.ok ? r.json() : false),

            // Liked status
            authFetch(`http://localhost:8080/api/movies/${id}/liked`)
                .then(r => r.ok ? r.json() : false),

            // Reviews
            authFetch(`http://localhost:8080/api/movies/${id}/reviews`)
                .then(r => r.ok ? r.json() : []),

            // User's previous rating (NEW)
            authFetch(`http://localhost:8080/api/movies/${id}/rating`)
                .then(r => r.ok ? r.json() : 0)
        ])
        .then(([movieData, watchedData, likedData, reviewsData, ratingData]) => {
            setMovie(movieData);
            setWatched(Boolean(watchedData));
            setLiked(Boolean(likedData));
            setReviews(reviewsData);
            setRating(Number(ratingData) || 0);   // ⭐ show existing rating
        })
        .catch(err => {
            console.error(err);
            setMovie(null);
        })
        .finally(() => {
            setLoading(false);
        });

    }, [id]);


    if (loading) {
        return <Typography p={4}>Loading movie...</Typography>;
    }
    if (!movie) {
        return <Typography p={4}>Movie not found</Typography>;
    }

    const handleLike = async () => {
        try {
            if (!liked) {
            await authFetch(`http://localhost:8080/api/movies/${movie.id}/like`, {
                method: "POST",
            });
            setLiked(true);
            alert("Liked ✅");
            } else {
            await authFetch(`http://localhost:8080/api/movies/${movie.id}/like`, {
                method: "DELETE",
            });
            setLiked(false);
            alert("Like removed ✅");
            }
        } catch (err) {
            console.error("Like failed:", err);
        }
    };

    const handleWatch = async () => {
        try {
            if (watched) {
            alert("Already watched ✅");
            return;
            }

            await authFetch(`http://localhost:8080/api/movies/${movie.id}/watch`, {
            method: "POST",
            });

            setWatched(true);
            alert("Added to history ✅");
        } catch (err) {
            console.error("Watch failed:", err);
        }
    };

    const handleRemoveWatch = async () => {
        try {
            await authFetch(`http://localhost:8080/api/movies/${movie.id}/watch`, {
                method: "DELETE",
            });

            setWatched(false);
            alert("Removed from history ✅");
        } catch (err) {
            console.error("Remove watch failed:", err);
        }
    };


    const handleAddReview = async () => {
        if (!comment.trim()) return;

        try {
            await authFetch(`http://localhost:8080/api/movies/${movie.id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ comment })
            });

            setComment("");

            // reload reviews
            const res = await authFetch(`http://localhost:8080/api/movies/${movie.id}/reviews`);
            const data = await res.json();
            setReviews(data);

        } catch (err) {
            console.error("Review failed:", err);
        }
    };

    const handleRate = async (newValue) => {
        if (!newValue) return;
        try {
            await authFetch(`http://localhost:8080/api/movies/${movie.id}/rate`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ rating: newValue })
            });

            console.log("Rated:", newValue);
        } 
        catch (err) {
            console.error("Rating failed:", err);
        }
    };
    return (
        <Box p={4}>
            <Grid container spacing={4}>
                
                {/* Poster */}
                <Grid>
                    <img
                        src={`http://localhost:8080${movie.posterUrl}`}
                        alt={movie.title}
                        style={{ width: 300, borderRadius: 8 }}
                    />
                </Grid>

                {/* Details */}
                <Grid xs={12} md={8}>
                    <Typography variant="h3" gutterBottom>
                        {movie.title}
                    </Typography>
                    <Typography variant="h6" mt={1}>
                        ⭐ {movie.avgRating?.toFixed(1) || "0"} / 5
                        ({movie.ratingsCount || 0} ratings)
                    </Typography>

                    <Typography variant="h6" color="gray" gutterBottom>
                        Genre: {movie.genres?.join(", ") || "N/A"}
                    </Typography>

                    <Typography variant="body1" mt={2}>
                        {movie.description}
                    </Typography>
                    <Box mt={3}>
                        <Typography variant="h6">Rate this movie:</Typography>
                        <Rating
                            value={rating || 0}
                            onChange={(e, newValue) => {
                                setRating(newValue);
                                handleRate(newValue);
                            }}
                            sx={{
                                "& .MuiRating-iconEmpty": {
                                color: "white"
                                }
                            }}
                        />
                    </Box>

                    {/* Buttons */}
                    <Box mt={4} display="flex" gap={2}>
                        {!watched ? (
                            <Button variant="contained" onClick={handleWatch}>
                            ▶ Watch
                            </Button>
                        ) : (
                            <Button variant="outlined" color="error" onClick={handleRemoveWatch}>
                            🗑 Remove from history
                            </Button>
                        )}

                        <Button variant="outlined" color="secondary" onClick={handleLike}>
                            {liked ? "💔 Remove Like" : "❤️ Like"}
                        </Button>
                    </Box>
                    {/* ================= COMMENTS SECTION ================= */}

                    <Box mt={6}>
                        <Typography variant="h5" gutterBottom>
                            Write a Review
                        </Typography>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={3}
                            style={{
                                width: "100%",
                                padding: 12,
                                borderRadius: 8,
                                border: "1px solid gray",
                                background: "#111",
                                color: "white"
                            }}
                            placeholder="Share your thoughts about this movie..."
                        />

                        <Button
                            variant="contained"
                            sx={{ mt: 2 }}
                            onClick={handleAddReview}
                        >
                            Submit Review
                        </Button>
                    </Box>

                    {/* ================= REVIEWS LIST ================= */}

                    <Box mt={5}>
                        <Typography variant="h5" gutterBottom>
                            Reviews
                        </Typography>

                        {reviews.length === 0 ? (
                            <Typography color="gray">
                                No reviews yet.
                            </Typography>
                        ) : (
                            reviews.map((r) => (
                                <Box
                                    key={r.id}
                                    mt={2}
                                    p={2}
                                    borderRadius={2}
                                    bgcolor="#1a1a1a"
                                >
                                    <Typography variant="body1">
                                        {r.comment}
                                    </Typography>

                                    <Typography variant="caption" color="gray">
                                        {new Date(r.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            ))
                        )}
                    </Box>

                </Grid>
            </Grid>
        </Box>
    );
}