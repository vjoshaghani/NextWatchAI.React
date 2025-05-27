import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./Components/Navbar";
import HomePage from "./Pages/HomePage";
import { FavoritesPage } from "./Pages/FavoritesPage";
import { LoginPage } from "./Pages/LoginPage";
import { RegisterPage } from "./Pages/RegisterPage";

import "./index.css";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <Navbar />
          <main className="pt-20 container mx-auto">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </main>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}
