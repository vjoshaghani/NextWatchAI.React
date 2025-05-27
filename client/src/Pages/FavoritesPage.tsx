// src/Pages/FavoritesPage.tsx
import React, { useEffect, useState } from "react";
import { useDebounce }                 from "react-use";
import { useNavigate }                 from "react-router-dom";
import { useAuth }                     from "../context/AuthContext";
import type { Movie }                  from "../types/Movie";
import type { FavoriteDto }            from "../types/FavoriteDto";
import MovieCard                       from "../Components/MovieCard";

// A little component that auto-saves its text 1s after you stop typing.
function NoteField({
  movieId,
  initialNote,
  onSave,
}: {
  movieId: number;
  initialNote: string;
  onSave: (movieId: number, note: string) => void;
}) {
  const [text, setText] = useState(initialNote);

  // Keep in sync if initialNote changes (e.g. on reload)
  useEffect(() => {
    setText(initialNote);
  }, [initialNote]);

  // Debounce the save: when `text` changes, wait 1s then call onSave
  useDebounce(
    () => {
      onSave(movieId, text);
    },
    1000,
    [text]
  );

  return (
    <textarea
      className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400 resize-none"
      rows={3}
      placeholder="Leave a note…"
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
  );
}

export const FavoritesPage: React.FC = () => {
  const { token }           = useAuth();
  const navigate            = useNavigate();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [notes, setNotes]   = useState<Record<number,string>>({});

  // 1) Load favorites & full TMDB details
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    (async () => {
      const favRes = await fetch("/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!favRes.ok) return;

      const favs: FavoriteDto[] = await favRes.json();
      // init note map
      const noteMap: Record<number,string> = {};
      favs.forEach((f) => (noteMap[f.tmdbId] = f.note || ""));
      setNotes(noteMap);

      // fetch TMDB details
      const tmdbKey = import.meta.env.VITE_TMDB_API_KEY!;
      const full = await Promise.all(
        favs.map((f) =>
          fetch(
            `https://api.themoviedb.org/3/movie/${f.tmdbId}?api_key=${tmdbKey}`
          ).then((r) => r.json() as Promise<Movie>)
        )
      );
      setMovies(full);
    })();
  }, [token, navigate]);

  // 2) Unfavorite
  const removeFavorite = async (id: number) => {
    const res = await fetch(`/api/favorites/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setMovies((ms) => ms.filter((m) => m.id !== id));
      setNotes((ns) => {
        const c = { ...ns };
        delete c[id];
        return c;
      });
    }
  };

  // 3) Save note (called by NoteField)
  const saveNote = async (id: number, note: string) => {
    const res = await fetch(`/api/favorites/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${token}`,
      },
      body: JSON.stringify({ note }),
    });
    if (!res.ok) console.error("Save note failed", await res.text());
  };

  // 4) Toggle favorite (only delete here)
  const onToggleFavorite = (movie: Movie) => removeFavorite(movie.id);

  return (
    <div className="mt-10">
      <h1 className="text-3xl font-bold mb-6 text-white">My Favorites</h1>
      {movies.length === 0 ? (
        <p className="text-gray-400">No favorites yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <li key={movie.id}>
              <MovieCard
                movie={movie}
                isFavorited={true}
                onToggleFavorite={onToggleFavorite}
              >
                {/* NoteField auto-saves after 1s of no typing */}
                <div className="px-3 py-2 bg-gray-800">
                  <NoteField
                    movieId={movie.id}
                    initialNote={notes[movie.id] || ""}
                    onSave={saveNote}
                  />
                </div>
              </MovieCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
