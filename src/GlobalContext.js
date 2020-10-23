import React, {
  useMemo,
  useEffect,
  createContext,
  useContext,
  useState,
} from "react";
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
  invoicedItems: [],
  notifications: [],
};
const GlobalContext = createContext(globalContext);
const useGlobals = () => useContext(GlobalContext);

const useUserData = () => {
  const getUserData = () => {
    const userFromLS = JSON.parse(localStorage.getItem("user"));
    if (userFromLS) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Basic ${userFromLS.mockedToken}`;
    }
    return userFromLS;
  };

  const setUserData = (value) => {
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

  return { getUserData, setUserData };
};

const GlobalContextProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [invoicedItems, setInvoicedItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const { getUserData, setUserData } = useUserData();

  const value = useMemo(
    () => ({
      error: error,
      loading: loading,
      invoicedItems: invoicedItems,
      notifications: notifications,
      user: user ? user : getUserData(),
      setLoading: (loadingParam) => setLoading(loadingParam),
      setError: (errorParam) => setError(errorParam),
      setUser: (userParam) => {
        setUserData(userParam);
        setUser(userParam);
      },
      setInvoicedItems: (invoicedItemsParam) =>
        setInvoicedItems(invoicedItemsParam),
      setNotifications: (notificationsParam) =>
        setNotifications(notificationsParam),
    }),
    [user, loading, error, invoicedItems, notifications]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
