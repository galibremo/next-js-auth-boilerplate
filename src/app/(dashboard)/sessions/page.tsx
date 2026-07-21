import type { Metadata } from "next";

import { SessionsPage } from "@/features/sessions/components/sessions-page";
import { buildPageMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return buildPageMetadata({
    title: "Sessions",
    description: "Manage your active sessions",
  });
}

export default function Sessions() {
  return <SessionsPage />;
}
