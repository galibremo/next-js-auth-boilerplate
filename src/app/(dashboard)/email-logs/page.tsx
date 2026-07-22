import type { Metadata } from "next";

import { EmailLogsPage } from "@/features/email-logs/components/email-logs-page";
import { buildPageMetadata } from "@/lib/metadata";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    title: "Email Logs",
    description: "View and filter email delivery logs.",
  });
}

export default function Page() {
  return <EmailLogsPage />;
}
