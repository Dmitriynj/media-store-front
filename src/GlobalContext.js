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
  },
  locale: undefined,
  invoicedItems: [],
  notifications: [],
};
const GlobalContext = createContext(globalContext);
const useGlobals = () => useContext(GlobalContext);
const AVAILABLE_LOCALES = ["en", "fr", "de"];

const useUserData = () => {
  const getUserDataFromLS = () => {
    let userFromLS;
    try {
      userFromLS = JSON.parse(localStorage.getItem("user"));
    } catch (e) {}
    if (userFromLS) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Basic ${userFromLS.mockedToken}`;
    }
    return userFromLS;
  };

  const setUserDataToLS = (value) => {
    if (!!value) {
      localStorage.setItem("user", JSON.stringify(value));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Basic ${value.mockedToken}`;
    } else {
      localStorage.removeItem("user");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const setLocaleToLS = (value) => {
    localStorage.setItem("locale", value);
    axios.defaults.headers.common["Accept-language"] = value;
  };

  const getLocaleFromLS = () => {
    const localeFromLS = localStorage.getItem("locale");
    const selectedLocale =
      localeFromLS &&
      localeFromLS !== "undefined" &&
      AVAILABLE_LOCALES.includes(localeFromLS)
        ? localeFromLS
        : "en";
    axios.defaults.headers.common["Accept-language"] = selectedLocale;
    return selectedLocale;
  };

  return { getUserDataFromLS, setUserDataToLS, setLocaleToLS, getLocaleFromLS };
};

const GlobalContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [invoicedItems, setInvoicedItems] = useState([]);
  const [user, setUser] = useState(null);
  const [locale, setLocale] = useState(undefined);
  const {
    getUserDataFromLS,
    setUserDataToLS,
    getLocaleFromLS,
    setLocaleToLS,
  } = useUserData();

  const value = useMemo(
    () => ({
      error: error,
      loading: loading,
      invoicedItems: invoicedItems,
      user: user ? user : getUserDataFromLS(),
      locale: locale ? locale : getLocaleFromLS(),
      setLoading,
      setError,
      setInvoicedItems,
      setUser: (userParam) => {
        setUserDataToLS(userParam);
        setUser(userParam);
      },
      setLocale: (localeParam) => {
        setLocaleToLS(localeParam);
        setLocale(localeParam);
      },
    }),
    [locale, user, loading, error, invoicedItems]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
