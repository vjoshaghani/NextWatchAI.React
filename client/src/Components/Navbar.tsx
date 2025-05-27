// src/Components/Navbar.tsx
import { Link, useLocation } from "react-router-dom";
import { HomeIcon, HeartIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();
  const isLoggedIn = Boolean(token);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full z-20 bg-gray-950/90 backdrop-blur border-b border-gray-800 p-4 flex items-center">
      <Link
        to="/"
        className={`flex items-center gap-1 mr-6 ${
          pathname === "/" ? "text-pink-500" : "text-gray-400 hover:text-white"
        }`}
      >
        <HomeIcon className="w-5 h-5" />
        Home
      </Link>

      <Link
        to="/favorites"
        className={`flex items-center gap-1 ${
          pathname === "/favorites"
            ? "text-pink-500"
            : "text-gray-400 hover:text-white"
        }`}
      >
        <HeartIcon className="w-5 h-5" />
        Favorites
      </Link>

      <div className="ml-auto">
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white border border-gray-700 hover:border-pink-500 text-sm px-3 py-1.5 rounded-md transition-colors"
          >
            Sign Out
          </button>
        ) : (
          <Link
            to="/login"
            className="text-gray-400 hover:text-white border border-gray-700 hover:border-pink-500 text-sm px-3 py-1.5 rounded-md transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
