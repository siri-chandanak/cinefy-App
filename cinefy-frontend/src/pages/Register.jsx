import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, FormGroup, FormControlLabel, Checkbox, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";

export default function Register()
{
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        country: "",
        city: "",
        languagePref: "",
        genres: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const genresList = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance"];
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };
    const handleGenreChange = (genre) => {
        if (form.genres.includes(genre)) {
            setForm({
                ...form,
                genres: form.genres.filter(g => g !== genre)
            });
        } 
        else {
            setForm({
                ...form,
                genres: [...form.genres, genre]
            });
        }
    };
    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try
        {
            const payload = {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                age: form.age ? Number(form.age) : null,
                gender: form.gender || null,
                country: form.country.trim() || null,
                city: form.city.trim() || null,
                languagePref: form.languagePref.trim() || null,
                genres: form.genres
            };
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(payload)
            });
            const data = await res.json().catch(() => ({}));

            if(!res.ok)
            {
                throw new Error(data.message || data.error || "Registration Failed");
            }
            navigate("/login");
        }
        catch(err)
        {
            setError(err.message || "Something went wrong");
        }
        finally
        {
            setLoading(false);
        }
        console.log(form);
    };
    return(
        <Container maxWidth = "sm">
            <Box mt = {8} p={4} boxShadow={3} borderRadius={3} bgcolor="#ffffff" sx ={{ color: "black"}}>
                <Typography variant="h4" align="center" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleRegister}>
                    <TextField 
                        fullWidth 
                        label="Full Name" 
                        name="name"
                        margin="normal" 
                        value={form.name}
                        onChange={handleChange}
                        required
                    /> 
                    <TextField
                        fullWidth 
                        label="Email" 
                        name="email"
                        margin="normal" 
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        margin="normal"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Age"
                        name="age"
                        type="number"
                        margin="normal"
                        value={form.age}
                        onChange={handleChange}
                    />
                    <TextField
                        select
                        fullWidth
                        label="Gender"
                        name="gender"
                        margin="normal"
                        value={form.gender}
                        onChange={handleChange}
                        >
                        <MenuItem value="">Prefer not to say</MenuItem>
                        <MenuItem value="MALE">Male</MenuItem>
                        <MenuItem value="FEMALE">Female</MenuItem>
                        <MenuItem value="OTHER">Other</MenuItem>
                    </TextField>
                    <TextField
                        fullWidth
                        label="Country"
                        name="country"
                        margin="normal"
                        value={form.country}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="City"
                        name="city"
                        margin="normal"
                        value={form.city}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Language Preference"
                        name="languagePref"
                        margin="normal"
                        value={form.languagePref}
                        onChange={handleChange}
                    />
                    <Typography sx={{ mt: 2, mb: 1 }} fontWeight="bold">
                        Favorite Genres
                    </Typography>
                    <FormGroup row>
                        {genresList.map((genre) => (
                        <FormControlLabel
                            key={genre}
                            control={
                            <Checkbox
                                checked={form.genres.includes(genre)}
                                onChange={() => handleGenreChange(genre)}
                            />
                            }
                            label={genre}
                        />
                        ))}
                    </FormGroup>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ mt:3 }}
                        type="submit"
                        disabled={loading}
                    >
                    {loading ? "Registering..." : "Register"}
                    </Button>
                </form>
                <Typography align="center" sx={{ mt: 2 }} >
                    Already have an account? <Link to="/login">Login</Link>
                </Typography>
            </Box>
        </Container>
    );
}