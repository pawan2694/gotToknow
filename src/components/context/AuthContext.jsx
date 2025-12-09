import React, { createContext, useState, useContext } from "react";
import { apiService } from "../../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = !!(user && user.email);

  // Real login with API
  const login = async ({ email, password }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiService.login({ email, password });
      
      if (response.success) {
        const userObj = { 
          email: response.user.email, 
          name: response.user.name,
          id: response.user.id 
        };
        setUser(userObj);
        localStorage.setItem("user", JSON.stringify(userObj));
        return { success: true };
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}