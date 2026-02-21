--
-- PostgreSQL database dump
--

\restrict umeJ97ybvsXQwAbSUoE776UfCdEdeOki4TK2Ztwj7hDV6igEkehypuS6RhIY8LK

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: interaction_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.interaction_type AS ENUM (
    'VIEW',
    'CLICK',
    'LIKE',
    'UNLIKE',
    'WATCH_START',
    'WATCH_END',
    'SEARCH'
);


ALTER TYPE public.interaction_type OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'USER',
    'ADMIN'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genres (
    id smallint NOT NULL,
    name character varying(60) NOT NULL
);


ALTER TABLE public.genres OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genres_id_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.genres_id_seq OWNER TO postgres;

--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genres_id_seq OWNED BY public.genres.id;


--
-- Name: movie_daily_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_daily_stats (
    movie_id uuid NOT NULL,
    day date NOT NULL,
    views_count bigint DEFAULT 0,
    watch_count bigint DEFAULT 0,
    watch_minutes bigint DEFAULT 0,
    likes_count bigint DEFAULT 0,
    ratings_count bigint DEFAULT 0,
    reviews_count bigint DEFAULT 0,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.movie_daily_stats OWNER TO postgres;

--
-- Name: movie_genres; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_genres (
    movie_id uuid NOT NULL,
    genre_id smallint NOT NULL
);


ALTER TABLE public.movie_genres OWNER TO postgres;

--
-- Name: movie_likes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_likes (
    id uuid NOT NULL,
    user_email character varying(255) NOT NULL,
    movie_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.movie_likes OWNER TO postgres;

--
-- Name: movie_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movie_reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    movie_id uuid NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.movie_reviews OWNER TO postgres;

--
-- Name: movies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(200) NOT NULL,
    description text,
    language character varying(40),
    release_year integer,
    duration_min integer,
    poster_url text,
    avg_rating numeric(3,2) DEFAULT 0.00 NOT NULL,
    ratings_count bigint DEFAULT 0 NOT NULL,
    total_views bigint DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT movies_duration_min_check CHECK (((duration_min >= 1) AND (duration_min <= 600))),
    CONSTRAINT movies_poster_url_check CHECK ((poster_url ~* '\.(jpg|jpeg|png|webp)$'::text)),
    CONSTRAINT movies_release_year_check CHECK (((release_year >= 1900) AND (release_year <= 2100)))
);


ALTER TABLE public.movies OWNER TO postgres;

--
-- Name: user_movie_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_movie_ratings (
    user_id uuid NOT NULL,
    movie_id uuid NOT NULL,
    rating integer,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT user_movie_ratings_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.user_movie_ratings OWNER TO postgres;

--
-- Name: user_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_preferences (
    user_id uuid NOT NULL,
    genre_id smallint NOT NULL,
    weight_score integer NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT user_preferences_weight_score_check CHECK (((weight_score >= 1) AND (weight_score <= 10)))
);


ALTER TABLE public.user_preferences OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role public.user_role DEFAULT 'USER'::public.user_role NOT NULL,
    age integer,
    gender character varying(30),
    country character varying(80),
    city character varying(80),
    language_pref character varying(40),
    movies_watched_count bigint DEFAULT 0 NOT NULL,
    likes_count bigint DEFAULT 0 NOT NULL,
    total_watched_minutes bigint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_age_check CHECK (((age >= 10) AND (age <= 100)))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: watch_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.watch_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    movie_id uuid NOT NULL,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    ended_at timestamp with time zone,
    watch_seconds integer DEFAULT 0 NOT NULL,
    completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.watch_sessions OWNER TO postgres;

--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres ALTER COLUMN id SET DEFAULT nextval('public.genres_id_seq'::regclass);


--
-- Name: genres genres_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_name_key UNIQUE (name);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (id);


--
-- Name: movie_daily_stats movie_daily_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_daily_stats
    ADD CONSTRAINT movie_daily_stats_pkey PRIMARY KEY (movie_id, day);


--
-- Name: movie_genres movie_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_pkey PRIMARY KEY (movie_id, genre_id);


--
-- Name: movie_likes movie_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_likes
    ADD CONSTRAINT movie_likes_pkey PRIMARY KEY (id);


--
-- Name: movie_reviews movie_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_reviews
    ADD CONSTRAINT movie_reviews_pkey PRIMARY KEY (id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movies
    ADD CONSTRAINT movies_pkey PRIMARY KEY (id);


--
-- Name: movie_likes uq_movie_like; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_likes
    ADD CONSTRAINT uq_movie_like UNIQUE (user_email, movie_id);


--
-- Name: user_movie_ratings user_movie_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_movie_ratings
    ADD CONSTRAINT user_movie_ratings_pkey PRIMARY KEY (user_id, movie_id);


--
-- Name: user_preferences user_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_pkey PRIMARY KEY (user_id, genre_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: watch_sessions watch_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watch_sessions
    ADD CONSTRAINT watch_sessions_pkey PRIMARY KEY (id);


--
-- Name: idx_movie_daily_stats_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movie_daily_stats_day ON public.movie_daily_stats USING btree (day);


--
-- Name: idx_movie_daily_stats_movie_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_movie_daily_stats_movie_day ON public.movie_daily_stats USING btree (movie_id, day);


--
-- Name: idx_reviews_movie; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_reviews_movie ON public.movie_reviews USING btree (movie_id);


--
-- Name: idx_user_preferences_genre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_preferences_genre ON public.user_preferences USING btree (genre_id);


--
-- Name: movie_daily_stats fk_movie_daily_stats_movie; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_daily_stats
    ADD CONSTRAINT fk_movie_daily_stats_movie FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_genres movie_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE RESTRICT;


--
-- Name: movie_genres movie_genres_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_genres
    ADD CONSTRAINT movie_genres_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_reviews movie_reviews_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_reviews
    ADD CONSTRAINT movie_reviews_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: movie_reviews movie_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movie_reviews
    ADD CONSTRAINT movie_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_preferences user_preferences_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(id) ON DELETE RESTRICT;


--
-- Name: user_preferences user_preferences_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_preferences
    ADD CONSTRAINT user_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: watch_sessions watch_sessions_movie_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watch_sessions
    ADD CONSTRAINT watch_sessions_movie_id_fkey FOREIGN KEY (movie_id) REFERENCES public.movies(id) ON DELETE CASCADE;


--
-- Name: watch_sessions watch_sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.watch_sessions
    ADD CONSTRAINT watch_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict umeJ97ybvsXQwAbSUoE776UfCdEdeOki4TK2Ztwj7hDV6igEkehypuS6RhIY8LK

