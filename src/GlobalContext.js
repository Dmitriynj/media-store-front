import React, {
  useEffect,
  useMemo,
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

  const { getUserToken, setUserToken } = useUserData();

  useEffect(() => {
    console.log("setting suer with token", getUserToken());
    setUser({ mockedToken: getUserToken() });
  }, []);

  const value = useMemo(() => {
    console.log("current globals: ", user, loading, error);

    return {
      error: error,
      loading: loading,
      user: user,
      setLoading: (loadingParam) => setLoading(loadingParam),
      setError: (errorParam) => setError(errorParam),
      setUser: (userParam) => {
        setUserToken(userParam.mockedToken);
        console.log("setting user", userParam);
        setUser(userParam);
      },
    };
  }, [user, loading, error]);

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
