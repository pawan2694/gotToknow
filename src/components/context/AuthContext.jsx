import react, {createContext, useState, useEffect, useContext} from "react";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // initialize from localStorage so login persists across refresh
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!(user && user.token);

  // login: here we create a fake token. Replace with API call later.
  const login = ({ email }) => {
    const fakeToken = "fake-jwt-token-" + Date.now();
    const userObj = { email, token: fakeToken };
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Optional: keep token validation/refresh logic here
  useEffect(() => {
    // e.g., validate token on mount or refresh
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
