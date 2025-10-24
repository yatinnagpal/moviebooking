import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedAdminRoute({ children }) {
  // Get user data from localStorage (or context if you’re using one)
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if user exists and is_admin is true
  if (user && user.is_admin) {
    return children; // allow access
  }

  // Otherwise, redirect to home or login
  return <Navigate to="/" replace />;
}

export default ProtectedAdminRoute;
