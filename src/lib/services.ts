import { cache } from "react";
import { cookies } from "next/headers";

export const getSessionUser = cache(async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies();
  const cookieString = cookieStore.toString();
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
});
