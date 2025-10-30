import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from './auth';

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const result = await verifyToken();
      setIsValid(result.valid);
    };
    checkAuth();
  }, []);

  if (isValid === null) return <p>Checking authentication...</p>;

  if (!isValid) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;

// navigate(-1) → goes back one step in the browser history
// navigate(-2) → goes back two steps
// navigate(1) → goes forward (like pressing forward button)
// <Navigate to={-1} />
// To check history window.history.length