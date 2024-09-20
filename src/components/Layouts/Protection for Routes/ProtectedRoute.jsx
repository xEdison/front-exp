import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element: Component, allowedRoles }) => {
  const userType = localStorage.getItem('userType');

  if (!allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
