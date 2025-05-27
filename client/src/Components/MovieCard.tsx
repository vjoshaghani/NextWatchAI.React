import React, { useState, type ReactNode } from "react";
import type { Movie } from "../types/Movie";
import { StarIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useLanguageName } from "../context/LanguageContext";

interface MovieCardProps {
  movie: Movie;
  isFavorited: boolean;
  onToggleFavorite: (movie: Movie) => void;
  children?: ReactNode;
}

export default function MovieCard({
  movie,
  isFavorited,
  onToggleFavorite,
  children,
}: MovieCardProps) {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const {
    title,
    vote_average,
    poster_path,
    original_language,
    release_date,
    overview,
  } = movie;

  return (
    <div className="movie-card select-none overflow-hidden rounded-2xl shadow-lg relative bg-gray-800 flex flex-col">
      {/* Poster + controls */}
      <div className="relative w-full pb-[150%] overflow-hidden rounded-t-2xl">
        <img
          draggable={false}
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/movie_icon.jpg"
          }
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* ℹ️ Info toggle */}
        <button
          onClick={toggleExpand}
          className="absolute top-2 left-2 z-10 bg-black/40 p-1 rounded-full hover:scale-110 transition"
        >
          <InformationCircleIcon className="w-5 h-5 text-white" />
        </button>

        {/* ❤️ Favorite toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie);
          }}
          className="absolute top-2 right-2 z-10 bg-black/40 p-1 rounded-full hover:scale-110 transition"
        >
          <HeartIconSolid
            className={`w-6 h-6 ${
              isFavorited ? "text-pink-500" : "text-white"
            }`}
          />
        </button>

        {/* Overview overlay */}
        {expanded && (
          <div
            className="absolute inset-0 bg-gray-900 bg-opacity-95 text-white p-4 flex flex-col"
            style={{ zIndex: 20 }}
          >
            <button
              onClick={toggleExpand}
              className="self-end mb-2 p-1 bg-black/40 rounded-full hover:scale-110 transition"
            >
              <XMarkIcon className="w-5 h-5 text-white" />
            </button>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm overflow-auto">{overview}</p>
          </div>
        )}
      </div>

      {/* Footer metadata */}
      <div className="px-3 py-2">
        <h3 className="text-sm font-semibold text-white truncate">{title}</h3>
        <div className="mt-1 flex items-center space-x-1 text-gray-400 text-xs">
          <StarIcon className="h-4 w-4 text-yellow-400" />
          <span>{vote_average?.toFixed(1) ?? "N/A"}</span>
          <span>•</span>
          <span>{useLanguageName(original_language)}</span>
          <span>•</span>
          <span>{release_date?.split("-")[0] ?? "N/A"}</span>
        </div>
      </div>

      {/* Any extra content inside the card */}
      {children}
    </div>
  );
}
