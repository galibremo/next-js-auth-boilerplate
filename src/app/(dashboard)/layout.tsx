import { DashboardLayout as DashboardLayoutWrapper } from "@/components/layout/dashboard-layout";

export default function DashboardLayout({
  children,
}: Readonly<GlobalLayoutProps>) {
  return <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>;
}
