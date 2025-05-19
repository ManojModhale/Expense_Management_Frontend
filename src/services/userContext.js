// src/services/UserContext.js
import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user data from sessionStorage:", error);
      return null;
    }
  });

  const updateUser = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
    if (userData) {
      sessionStorage.setItem("role", userData.role.toUpperCase());
      sessionStorage.setItem("username", userData.username);
    } else {
      sessionStorage.clear(); // Clear session storage on logout
    }
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
