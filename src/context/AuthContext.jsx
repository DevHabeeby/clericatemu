
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("temu-demo-user")) || null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // Register a demo account
  const register = async (name, email, password) => {
    const savedUser = JSON.parse(
      localStorage.getItem("temu-demo-account") || "null"
    );

    if (savedUser && savedUser.email === email) {
      throw { code: "auth/email-already-in-use" };
    }

    if (!name || !email || !password) {
      throw { code: "auth/invalid-credential" };
    }

    // Password is checked for the demo but never saved.
    const newUser = {
      displayName: name,
      email: email,
    };

    localStorage.setItem("temu-demo-account", JSON.stringify(newUser));
    localStorage.setItem("temu-demo-user", JSON.stringify(newUser));

    setUser(newUser);
    return newUser;
  };

  // Login to the demo account
  const login = async (email, password) => {
    const savedUser = JSON.parse(
      localStorage.getItem("temu-demo-account") || "null"
    );

    if (!savedUser || savedUser.email !== email || !password) {
      throw { code: "auth/invalid-credential" };
    }

    localStorage.setItem("temu-demo-user", JSON.stringify(savedUser));
    setUser(savedUser);

    return savedUser;
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("temu-demo-user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
