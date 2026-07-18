import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout as DashboardLayoutWrapper } from "@/components/layout/dashboard-layout";

async function getSessionUser(cookieString: string): Promise<AuthUser | null> {
  if (!cookieString) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/session`,
      {
        headers: {
          Cookie: cookieString,
        },
        cache: "no-store",
      },
    );

    if (res.ok) {
      const json = await res.json();
      return json.data;
    }
  } catch (error) {
    console.error("Failed to fetch session on server:", error);
  }
  return null;
}

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
