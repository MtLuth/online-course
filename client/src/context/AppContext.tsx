"use client";

import React, { createContext, useContext, useState } from "react";

const AppContext = createContext({
  sessionToken: "",
  userRole: "",
  setSessionToken: (token: string) => {},
  setUserRole: (role: string) => {},
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used within an AppProvider");
  }
  return context;
};

export default function AppProvider({
  children,
  initialToken = "",
  initialRole = "",
}: {
  children: React.ReactNode;
  initialToken?: string;
  initialRole?: string;
}) {
  const [sessionToken, setSessionToken] = useState(initialToken);
  const [userRole, setUserRole] = useState(initialRole);

  return (
    <AppContext.Provider
      value={{ sessionToken, setSessionToken, userRole, setUserRole }}
    >
      {children}
    </AppContext.Provider>
  );
}
