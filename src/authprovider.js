import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, useTheme } from "@mui/material"; // Material-UI components
import { tokens } from "./theme"; // Assuming you have theme tokens

// Create the AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap around your app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Holds the authenticated user
  const [loading, setLoading] = useState(true); // Loading state while Firebase checks the user
  const navigate = useNavigate();
  const theme = useTheme(); // Get the current theme
  const colors = tokens(theme.palette.mode); // Use the tokens from your theme

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user if they are authenticated
      setLoading(false); // Stop loading once Firebase returns user data
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // Navigate to the dashboard on successful login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login. Please check your credentials and try again."); // Show alert on login failure
    }
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setUser(null); // Clear the user state
    navigate("/login"); // Navigate to login page after logout
  };

  // Show loading spinner or message while Firebase is checking user state
  if (loading) {
    return (
      <Box
        height="100vh" // Full viewport height
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor={colors.primary[400]} // Apply background color from theme
      >
        <CircularProgress size={60} sx={{ color: colors.greenAccent[500] }} /> {/* Circular loading spinner */}
      </Box>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children} {/* Render the rest of your app once loading is done */}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};




