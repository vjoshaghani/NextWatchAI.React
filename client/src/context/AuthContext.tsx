import { createContext, useContext, useState, type ReactNode, useEffect } from "react";

interface AuthContextType {
  token: string | null;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      setToken(saved);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    let timer: ReturnType<typeof setTimeout>;

    try {
      // decode the payload part of the JWT
      const [, payloadB64] = token.split(".");
      const { exp }       = JSON.parse(atob(payloadB64)) as { exp: number };
      const msUntilExpiry = exp * 1000 - Date.now();

      if (msUntilExpiry <= 0) {
        // already expired
        logout();
      } else {
        timer = setTimeout(() => {
          logout();
        }, msUntilExpiry);
      }
    } catch {
      // if anything goes wrong decoding, just clear out
      logout();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token]);

  const login = (t: string) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
