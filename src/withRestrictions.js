import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import axios from "axios";
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
    const { getUser, invoicedItems } = useGlobals();
    const user = getUser();
    // const currentUserRestr = {
    //   isAuth: user.isAuth,
    // };
    // console.log("currentUserRestr", currentUserRestr);
    // console.log("restrictions", restrictions);
    // const isUserMeetRestrictions =
    //   currentUserRestr.isAuth === restrictions.isAuth;

    return isUserMeetRestrictions({ user, invoicedItems }) ? (
      <Component {...props} />
    ) : (
      <Redirect exact to="/error" />
    );
  };
};

export { withRestrictions };
