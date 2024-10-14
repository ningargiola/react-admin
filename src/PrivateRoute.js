import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authprovider"; // Ensure this is the correct path

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
  
    if (!user) {
      return <Navigate to="/login" />;
    }
  
    return children;
};

export default PrivateRoute;


