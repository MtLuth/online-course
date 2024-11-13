"use client";

import React, { createContext, useContext, useState } from "react";

const AppContext = createContext({
  token: "",
  setSectionToken: (token: string) => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("must be used within an appprovider");
  }
  return context;
};

export default function AppProvider({
  children,
  initialToken = "",
}: {
  children: React.ReactNode;
  initialToken: string;
}) {
  const [sessionToken, setSessionToken] = useState(initialToken);
  return (
    <AppContext.Provider value={{ sessionToken, setSessionToken }}>
      {children}
    </AppContext.Provider>
  );
}
