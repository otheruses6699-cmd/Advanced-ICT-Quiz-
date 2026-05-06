import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, StorageArea } from "./storage";

interface AuthContextType {
  user: User | null;
  login: (roll: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedRoll = localStorage.getItem("ict_active_user");
    if (savedRoll) {
      const foundUser = StorageArea.getUserByRoll(savedRoll);
      if (foundUser) setUser(foundUser);
    }
    setLoading(false);
  }, []);

  const login = (roll: string) => {
    const foundUser = StorageArea.getUserByRoll(roll);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("ict_active_user", roll);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ict_active_user");
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
