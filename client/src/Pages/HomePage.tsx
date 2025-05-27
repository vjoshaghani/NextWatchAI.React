// src/Pages/HomePage.tsx
import React, { useState, useEffect } from "react";
import { useDebounce } from "react-use";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import type { Movie } from "../types/Movie";
import Search from "../Components/Search";
import Spinner from "../Components/Spinner";
import MovieCard from "../Components/MovieCard";
import AIButton from "../Components/AIButton";

const HomePage: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  // Debounce user input before kicking off TMDB fetch
  useDebounce(
    () => setDebouncedTerm(searchTerm),
    500,
    [searchTerm]
  );

  // Load popular or searched movies from your server-side TMDB proxy
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError("");
      try {
        const url = debouncedTerm
          ? `/api/tmdb/search?query=${encodeURIComponent(debouncedTerm)}`
          : `/api/tmdb/popular`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`TMDB proxy ${res.status}`);
        const json = await res.json();
        setMovies(json.results || []);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [debouncedTerm]);

  // Load user favorites so hearts render correctly
  useEffect(() => {
    if (!token) {
      setFavoriteIds([]);
      return;
    }
    (async () => {
      const res = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const list: { tmdbId: number }[] = await res.json();
        setFavoriteIds(list.map((f) => f.tmdbId));
      }
    })();
  }, [token]);

  // Toggle favorite: push to /api/favorites
  const toggleFavorite = async (movie: Movie) => {
    if (!token) {
      navigate("/login");
      return;
    }
    const isFav = favoriteIds.includes(movie.id);
    const url = isFav
      ? `/api/favorites/${movie.id}`
      : `/api/favorites`;
    const opts = {
      method: isFav ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      } as Record<string, string>,
      body: isFav ? undefined : JSON.stringify({ tmdbId: movie.id }),
    };
    const res = await fetch(url, opts);
    if (res.ok) {
      setFavoriteIds((prev) =>
        isFav ? prev.filter((id) => id !== movie.id) : [...prev, movie.id]
      );
    }
  };

  return (
    <>
      {/* Hero Banner with centered search */}
      <div className="relative w-full overflow-hidden rounded-xl shadow-md max-h-[60vh] md:max-h-[500px]">
        <img
          src="/hero.jpg"
          alt="Hero banner"
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/30 rounded-xl pointer-events-none" />
        <div className="absolute inset-0 flex flex-col justify-start items-center px-4 pt-[30%] sm:pt-[25%] md:pt-[20%]">
          <h1 className="text-gradient text-[clamp(1.5rem,5vw,2.5rem)] font-bold drop-shadow-md mb-4">
            Find the perfect film — for every mood
          </h1>
          <div className="w-full max-w-md">
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <section>
        <h2 className="section-title mt-10 mb-6 text-left">
          {searchTerm ? `Results for "${searchTerm}"` : "Popular Movies"}
        </h2>

        {isLoading ? (
          <Spinner />
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                isFavorited={favoriteIds.includes(movie.id)}
                onToggleFavorite={() => toggleFavorite(movie)}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Floating AI Quick-Search Button */}
      <AIButton onRecommend={setSearchTerm} />
    </>
  );
};

export default HomePage;
