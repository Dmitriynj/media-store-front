import React, { useMemo, createContext, useContext, useState } from "react";
const globalContext = {
  globals: {
    error: {},
    loading: true,
    invoicedTrackIds: [],
  },
  setGlobals: () => {},
};
const GlobalContext = createContext(globalContext);
const useGlobals = () => useContext(GlobalContext);

const GlobalContextProvider = ({ children }) => {
  const [globals, setGlobals] = useState({});

  const value = useMemo(
    () => ({
      error: globals.error,
      loading: globals.loading,
      setLoading: (loading) => setGlobals({ ...globals, loading }),
      setError: (error) => setGlobals({ ...globals, error }),
    }),
    [globals]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
