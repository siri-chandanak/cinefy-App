# 🎬 Cinefy – Scalable Movie Recommendation Platform (Frontend)

Cinefy is a production-grade movie recommendation frontend built with **React + Vite + Material UI**, designed to integrate with a Spring Boot analytics-driven backend.

This project demonstrates:

- Scalable frontend architecture
- JWT-based authentication
- Real-time analytics integration
- Personalized recommendation rendering
- Engagement-based trending logic
- Clean API abstraction layer
- Production-ready environment configuration

> This is not a tutorial app.  
> It is designed as a full-stack scalable system.

---

# 🚀 Executive Summary

Cinefy enables users to:

- Browse movies
- View detailed metadata
- Like, watch, rate, and review movies
- Receive personalized recommendations
- View trending movies powered by analytics

The frontend is stateless and communicates with a secure backend API using JWT-based authentication.

---

# 🧱 System Architecture

## High-Level Architecture

```
                   ┌──────────────────────────────┐
                   │          Client (Browser)     │
                   │        React + Vite App       │
                   └──────────────┬───────────────┘
                                  │
                                  │ HTTPS / REST
                                  ▼
                   ┌──────────────────────────────┐
                   │       Spring Boot API        │
                   │  Auth • Movies • Analytics   │
                   └──────────────┬───────────────┘
                                  │
                     ┌────────────┴────────────┐
                     ▼                         ▼
        ┌──────────────────────┐   ┌──────────────────────┐
        │ PostgreSQL Database  │   │ File Storage (Uploads)│
        │ Movies • Stats • JWT │   │ Posters / Images      │
        └──────────────────────┘   └──────────────────────┘
```

---

# 🧠 Frontend Architecture

```
src/
│
├── api/               # API abstraction layer
│   └── authFetch.js   # Secure request wrapper
│
├── components/        # Reusable UI components
│   ├── MovieCard.jsx
│   ├── Navbar.jsx
│   └── ProtectedRoute.jsx
│
├── pages/             # Page-level containers
│   ├── Dashboard.jsx
│   ├── Movies.jsx
│   ├── MovieDetails.jsx
│   ├── Recommendations.jsx
│   ├── History.jsx
│   ├── Profile.jsx
│   └── AdminAddMovie.jsx
│
├── routes/            # Route configuration
│
├── App.jsx
└── main.jsx
```

### Architectural Principles

- Separation of concerns
- Stateless UI components
- API abstraction layer
- Centralized authentication logic
- Environment-based configuration
- No hardcoded backend URLs

---

# ✨ Core Features

## 🎥 Movie Experience

- Browse all movies
- Movie detail pages
- Dynamic poster rendering
- Genre-based display
- Real-time ratings
- Reviews system

## ❤️ Engagement

- Like / Unlike movies
- Watch history tracking
- Per-user rating storage
- Comment-based reviews

## 📊 Analytics Integration

Frontend integrates with backend-driven analytics:

Trending score is computed using:

```
score =
  (views_count * 2) +
  (watch_count * 3) +
  (likes_count * 4) +
  (ratings_count * 2) +
  (reviews_count * 3)
```

Analytics are stored in:

- `movie_daily_stats`
- `user_movie_ratings`
- `movie_reviews`

---

# 🔐 Authentication Architecture

## Flow

1. User logs in
2. Backend returns JWT
3. Token stored in `localStorage`
4. `authFetch` attaches:

```
Authorization: Bearer <token>
```

5. Protected routes validate token
6. Expired token triggers logout

## Route Protection

Protected pages:

- Recommendations
- History
- Profile
- Admin

---

# 📦 Installation

## Prerequisites

- Node.js v16+
- npm or yarn
- Backend API running

## Setup

```bash
git clone https://github.com/siri-chandanak/movie-recommendation-frontend.git
cd movie-recommendation-frontend
npm install
```

Create `.env`:

```
VITE_API_BASE_URL=http://localhost:8080
```

Run:

```
npm run dev
```

Access:

```
http://localhost:5173
```

---

# 🔗 Required Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/movies` | List movies |
| GET | `/api/movies/{id}` | Movie details |
| GET | `/api/movies/trending` | Trending |
| GET | `/api/recommendations` | Personalized |
| POST | `/api/movies/{id}/like` | Like |
| POST | `/api/movies/{id}/watch` | Watch |
| POST | `/api/movies/{id}/rate` | Rate |
| POST | `/api/movies/{id}/review` | Review |
| GET | `/api/genres` | Genres |

---

# ⚙️ Production Considerations

## Security

- JWT-based authentication
- No sensitive logic in frontend
- Environment-based API URL
- Protected routes
- Token expiration validation

## Performance

- Component-based rendering
- Efficient state updates
- Backend-driven pagination ready
- Optimized API calls
- Lazy loading support (future enhancement)

## Scalability

- Backend handles recommendation logic
- Frontend remains stateless
- Analytics computation server-side
- Supports Redis caching for trending (backend)

---

# 📊 Analytics Data Flow

```
User Interaction
      │
      ▼
MovieDetails API Call
      │
      ▼
AnalyticsService (Backend)
      │
      ▼
movie_daily_stats table
      │
      ▼
Trending API
      │
      ▼
Frontend UI Ranking
```

---

Please refer "https://github.com/siri-chandanak/cinefy-App" for the full stack implementation.

---

# 📈 Future Roadmap

- Dark / Light theme toggle
- Debounced search
- Infinite scroll
- Advanced filtering
- Chart-based analytics dashboard
- Server-side rendering
- Redis caching for trending
- Dockerized deployment
- CI/CD pipeline

---

# 🚀 Deployment Strategy

## Frontend

- Vercel
- Netlify
- Nginx static hosting

## Backend

- Docker container
- AWS EC2
- Render / Railway
- Kubernetes (scalable setup)

---

# 🧩 Design Philosophy

- Clean architecture
- Production-first mindset
- Real analytics integration
- Separation of UI and business logic
- Scalable system thinking

---

# 👩‍💻 Author

Built by **Siri Chandana**

Full-stack implementation including:

- React Frontend
- Spring Boot Backend
- PostgreSQL
- JWT Security
- Analytics Engine
- Recommendation System