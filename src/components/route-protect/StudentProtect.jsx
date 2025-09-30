import React from "react";
import { Navigate } from "react-router-dom";

const StudentProtectedRoute = ({ children }) => {
  const userRole = sessionStorage.getItem("userRole");

  if (userRole !== "student") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default StudentProtectedRoute;
