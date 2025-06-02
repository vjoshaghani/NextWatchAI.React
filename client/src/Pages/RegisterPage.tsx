// src/Pages/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate }      from "react-router-dom";

export function RegisterPage() {
  const [email, setEmail]             = useState("");
  const [password, setPassword]       = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [error, setError]             = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password, confirmPassword }),
      });
      if (res.status === 201) {
        navigate("/login");
      } else {
        const data = await res.json();
        setError(
          data.errors
            ? Array.isArray(data.errors)
              ? data.errors.join(", ")
              : data.errors
            : data.message || "Registration failed"
        );
      }
    } catch {
      setError("Server unreachable");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>
      {isSubmitting && (
        <div className="mb-4 p-2 bg-yellow-600 text-yellow-100 rounded">
          🔄 Waking up the server… this may take a few seconds.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
            disabled={ isSubmitting}
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 placeholder-gray-400"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-600 hover:bg-pink-500 text-white rounded px-3 py-2"
        >
          {isSubmitting ? "Registering…" : "Register"}
        </button>
      </form>
    </div>
  );
}
