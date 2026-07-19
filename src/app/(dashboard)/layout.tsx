import { redirect } from "next/navigation";
import { DashboardLayout as DashboardLayoutWrapper } from "@/components/layout/dashboard-layout";
import { getSessionUser } from "@/lib/services";

export default async function DashboardLayout({
  children,
}: Readonly<GlobalLayoutProps>) {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
