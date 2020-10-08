import React, { useMemo, createContext, useContext, useState } from "react";
const globalContext = {
  loading: {},
  setLoading: () => {},
};
const GlobalContext = createContext(globalContext);
const useGlobals = () => useContext(GlobalContext);

const GlobalContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const value = useMemo(
    () => ({
      loading: loading,
      setLoading: (loadingProp) => setLoading(loadingProp),
    }),
    [loading]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

export { GlobalContextProvider, useGlobals };
