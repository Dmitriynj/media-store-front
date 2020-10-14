import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";

const withAuthentication = (Component, isAuthNeeded) => {
  return (props) => {
    const isAuthenticated = axios.defaults.headers.common["Authorization"];
    return !!isAuthenticated ? (
      <Component {...props} />
    ) : (
      <Redirect exact to="/login" />
    );
  };
};

export { withAuthentication };
