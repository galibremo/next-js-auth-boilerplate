import { BreadcrumbContext } from "@/providers/breadcrumb-provider";
import { useContext } from "react";

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
}
