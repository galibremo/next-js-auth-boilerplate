"use client";

import { createContext, useState } from "react";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
  user: AuthUser | null;
}

export default function AuthProvider({
  children,
  user,
}: Readonly<AuthProviderProps>) {
  const [updatedUser, setUpdatedUser] = useState<AuthUser | null>(user);

  const setUser = (nextUser: AuthUser | null) => {
    setUpdatedUser(nextUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user: updatedUser,
        isAuthenticated: Boolean(updatedUser),
        isLoading: false,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
