import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout as DashboardLayoutWrapper } from "@/components/layout/dashboard-layout";
import { getSessionUser } from "@/lib/services";

export default async function DashboardLayout({
  children,
}: Readonly<GlobalLayoutProps>) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();
  const user = await getSessionUser(allCookies);

  if (!user) {
    redirect("/login");
  }

  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
