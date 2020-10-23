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

const useUserData = () => {
  const getUserDataFromLS = () => {
    const userFromLS = JSON.parse(localStorage.getItem("user"));
    if (userFromLS) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Basic ${userFromLS.mockedToken}`;
    }
    return userFromLS;
  };

  const setUserDataToLS = (value) => {
    if (!!value) {
      localStorage.setItem("user", value);
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
      localeFromLS && localeFromLS !== "undefined" ? localeFromLS : "en";
    axios.defaults.headers.common["Accept-language"] = selectedLocale;
    return selectedLocale;
  };

  return { getUserDataFromLS, setUserDataToLS, setLocaleToLS, getLocaleFromLS };
};

const GlobalContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [invoicedItems, setInvoicedItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(undefined);
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
      notifications: notifications,
      user: user ? user : getUserDataFromLS(),
      locale: locale ? locale : getLocaleFromLS(),
      setLocale: (localeParam) => {
        setLocaleToLS(localeParam);
        setLocale(localeParam);
      },
      setLoading: (loadingParam) => setLoading(loadingParam),
      setError: (errorParam) => setError(errorParam),
      setUser: (userParam) => {
        setUserDataToLS(userParam);
        setUser(userParam);
      },
      setInvoicedItems: (invoicedItemsParam) =>
        setInvoicedItems(invoicedItemsParam),
      setNotifications: (notificationsParam) =>
        setNotifications(notificationsParam),
    }),
    [locale, user, loading, error, invoicedItems, notifications]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
