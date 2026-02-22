import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip
} from "@mui/material";
import { authFetch } from "../api/api";


export default function AdminAddMovie() {

  const [movie, setMovie] = useState({
    title: "",
    description: "",
    language: "",
    releaseYear: "",
    durationMin: "",
    posterUrl: "",
    genres: []
  });
  const [genresList, setGenresList] = useState([]);

  useEffect(() => {
    authFetch("http://localhost:8080/api/genres")
      .then(res => res.json())
      .then(data => setGenresList(data));
  }, []);

  const handleChange = (e) => {
    setMovie({
      ...movie,
      [e.target.name]: e.target.value
    });
  };

  const handleGenreChange = (event) => {
    setMovie({
      ...movie,
      genres: event.target.value
    });
  };

  const handleFileChange = (e) => { 
      const file = e.target.files[0]; 
      if (file) { 
        setMovie(
          { ...movie, posterFile: file, posterPreview: URL.createObjectURL(file) }
        );
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!movie.posterFile) {
      alert("Please select a poster image");
      return;
    }

    const formData = new FormData();
    formData.append("title", movie.title);
    formData.append("description", movie.description);
    formData.append("language", movie.language);
    formData.append("releaseYear", movie.releaseYear);
    formData.append("durationMin", movie.durationMin);
    formData.append("poster", movie.posterFile);

    // IMPORTANT: send genreIds like: genreIds=1&genreIds=2...
    movie.genres.forEach((gid) => formData.append("genreIds", gid));

    try {
      const res = await authFetch("http://localhost:8080/api/admin/movies", {
        method: "POST",
        body: formData
        // DO NOT set Content-Type manually for FormData
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      alert("Movie added ✅");
      console.log(data);
    } catch (err) {
      console.error(err);
      alert("Error adding movie");
    }
};


  return (
    <Container maxWidth="sm">
      <Box mt={6} p={4} boxShadow={3} borderRadius={3} bgcolor="#ffffff" sx={{ color: "black" }}>

        <Typography variant="h4" align="center" gutterBottom>
          Add New Movie
        </Typography>

        <TextField
          fullWidth
          label="Movie Title"
          name="title"
          margin="normal"
          value={movie.title}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          margin="normal"
          multiline
          rows={3}
          value={movie.description}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Language"
          name="language"
          margin="normal"
          value={movie.language}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Release Year"
          name="releaseYear"
          margin="normal"
          value={movie.releaseYear}
          onChange={handleChange}
        />

        <TextField
          fullWidth
          label="Duration (minutes)"
          name="durationMin"
          margin="normal"
          value={movie.durationMin}
          onChange={handleChange}
        />

        {/* Upload Poster */} 
        <Box mt={3}> 
          <Typography variant="subtitle1" gutterBottom> 
            Upload Poster
          </Typography> 
          <Button variant="outlined" component="label"> 
            Choose File <input type="file" hidden accept="image/*" onChange={handleFileChange} /> 
          </Button>
           {movie.posterFile && ( 
            <Box mt={2}> 
              <Typography variant="body2"> 
                Selected: {movie.posterFile.name} 
              </Typography> <img src={movie.posterPreview} alt="Poster Preview" style={{ width: "150px", marginTop: "10px", borderRadius: "8px", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }} /> 
            </Box> )} 
        </Box>

        {/* MULTI GENRE SELECT */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Genres</InputLabel>
          <Select
            multiple
            value={movie.genres}
            onChange={handleGenreChange}
            input={<OutlinedInput label="Genres" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const genre = genresList.find(g => g.id === value);
                  return <Chip key={value} label={genre?.name} />;
                })}
              </Box>
            )}
          >
            {genresList.map((g) => (
              <MenuItem key={g.id} value={g.id}>
                {g.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Add Movie
        </Button>

      </Box>
    </Container>
  );
}
