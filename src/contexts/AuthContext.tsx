import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, signIn, signUp, signOut, getAllUsernames } from "@/lib/auth";

interface AuthContextType {
  user: string | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  allUsers: string[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(getCurrentUser());

  const login = async (username: string, password: string) => {
    const result = await signIn(username, password);
    if (result.success) setUser(username.trim());
    return result;
  };

  const register = async (username: string, password: string) => {
    const result = await signUp(username, password);
    if (result.success) setUser(username.trim());
    return result;
  };

  const logout = () => {
    signOut();
    setUser(null);
  };

  const allUsers = getAllUsernames();

  return (
    <AuthContext.Provider value={{ user, login, register, logout, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
