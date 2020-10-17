import React, { useMemo, createContext, useContext, useState } from "react";
import axios from "axios";

const globalContext = {
  error: {},
  loading: true,
  user: {
    ID: undefined,
    roles: [],
    email: undefined,
    level: undefined,
    mockedToken: undefined,
    isAuth: undefined,
  },
  invoicedItems: [],
};
const GlobalContext = createContext(globalContext);
const useGlobals = () => useContext(GlobalContext);

const useUserData = () => {
  const setDefaultAuthHeader = (value) => {
    axios.defaults.headers.common["Authorization"] = `Basic ${value}`;
  };

  const getUserToken = () => {
    const token = localStorage.getItem("userToken");
    if (!!token && token !== "undefined") {
      setDefaultAuthHeader(token);
    }
    if (token === "undefined") {
      return undefined;
    }
    return token;
  };
  const setUserToken = (token) => {
    setDefaultAuthHeader(token);
    localStorage.setItem("userToken", token);
  };

  return { getUserToken, setUserToken };
};

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [invoicedItems, setInvoicedItems] = useState([]);

  const { getUserToken, setUserToken } = useUserData();
  const getUser = () => {
    const mockedToken = getUserToken();
    const isAuth = !!mockedToken;
    return { isAuth, mockedToken };
  };

  const value = useMemo(() => {
    console.log("current globals: ", user, loading, error);

    return {
      error: error,
      loading: loading,
      invoicedItems: invoicedItems,
      setLoading: (loadingParam) => setLoading(loadingParam),
      setError: (errorParam) => setError(errorParam),
      setUser: (userParam) => {
        setUserToken(userParam.mockedToken);
        console.log("setting user", userParam);
        setUser(userParam);
      },
      getUser: () => getUser(),
      setInvoicedItems: (invoicedItemsParam) =>
        setInvoicedItems(invoicedItemsParam),
    };
  }, [user, loading, error, invoicedItems]);

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
