import { jwtDecode } from "jwt-decode";
import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  // Retrieve tokens from localStorage
  const tokenCustomer = localStorage.getItem("jwt-token-customer");
  const tokenBusiness = localStorage.getItem("jwt-token-business");

  // Add more tokens if needed

  // Check if any of the tokens are authenticated
  const isAuthenticatedCustomer = tokenCustomer !== null;
  const isAuthenticatedBusiness = tokenBusiness !== null;

  // Add more isAuthenticated variables for other tokens

  // Check if any of the tokens are expired
  let isTokenExpiredCustomer = false;
  let isTokenExpiredBusiness = false;

  // Add more isTokenExpired variables for other tokens

  // Check token expiration and handle expired tokens if needed
  if (tokenCustomer) {
    const decodedToken = jwtDecode(tokenCustomer);
    const currentTime = Date.now() / 1000;
    isTokenExpiredCustomer = decodedToken.exp < currentTime;
    if (isTokenExpiredCustomer) {
      localStorage.removeItem("jwt-token-customer");
    }
  }
  if (tokenBusiness) {
    const decodedToken = jwtDecode(tokenBusiness);
    const currentTime = Date.now() / 1000;
    isTokenExpiredBusiness = decodedToken.exp < currentTime;
    if (isTokenExpiredBusiness) {
      localStorage.removeItem("jwt-token-business");
    }
  }

  // Add more logic to handle expiration for other tokens

  // Determine whether to render children or redirect based on authentication status
  const renderContent = () => {
    // Check authentication status for each token and handle redirection if any token is not authenticated or expired
    if (isAuthenticatedCustomer && !isTokenExpiredCustomer) {
      return children;
    } else if (isAuthenticatedBusiness && !isTokenExpiredBusiness) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return renderContent();
};

PrivateRoute.propTypes = {
  children: PropTypes.node,
};

export default PrivateRoute;
