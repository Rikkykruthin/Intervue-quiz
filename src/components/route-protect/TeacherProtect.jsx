import React from "react";
import { Navigate } from "react-router-dom";

const TeacherProtectedRoute = ({ children }) => {
  const username = sessionStorage.getItem("username");
  const userRole = sessionStorage.getItem("userRole");

  // Check if user is authenticated as teacher
  if (!username || userRole !== "teacher") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default TeacherProtectedRoute;
