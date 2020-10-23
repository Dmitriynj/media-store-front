import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useGlobals } from "./GlobalContext";

const pagesConfig = {
  "/person": {
    isAuth: true,
  },
  "/login": {
    isAuth: false,
  },
};

const withRestrictions = (Component, isUserMeetRestrictions) => {
  return (props) => {
    const { user, invoicedItems } = useGlobals();
    console.log("checkoing requirements", user);

    return isUserMeetRestrictions({ user, invoicedItems }) ? (
      <Component {...props} />
    ) : (
      <Redirect exact to="/error" />
    );
  };
};

export { withRestrictions };
