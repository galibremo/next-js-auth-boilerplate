import { RedirectContext } from "@/providers/redirect-provider";
import { useContext } from "react";

export default function useRedirect() {
  const context = useContext(RedirectContext);
  if (context === undefined) {
    throw new Error("useRedirect must be used within a RedirectProvider");
  }
  return context;
}
