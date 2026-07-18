"use client";

import { createContext } from "react";
import { useSearchParams } from "next/navigation";

interface RedirectContextType {
  redirectUrl: string | null;
  getRedirectUrl: (baseUrl: string) => string;
}

export const RedirectContext = createContext<RedirectContextType | undefined>(
  undefined,
);

export function RedirectProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect");

  const getRedirectUrl = (baseUrl: string): string => {
    if (!redirectUrl) return baseUrl;

    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}redirect=${encodeURIComponent(redirectUrl)}`;
  };

  return (
    <RedirectContext.Provider value={{ redirectUrl, getRedirectUrl }}>
      {children}
    </RedirectContext.Provider>
  );
}
