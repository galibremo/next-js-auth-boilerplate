import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import { LoginSchemaType } from "../schemas/login-schema";

export async function login(data: LoginSchemaType): Promise<AuthUser> {
  return fetchClient<AuthUser>({
    method: "POST",
    url: apiRoute.login,
    body: data,
  });
}

export async function googleLogin(idToken: string): Promise<AuthUser> {
  return fetchClient<AuthUser>({
    method: "POST",
    url: apiRoute.googleLogin,
    body: { idToken },
  });
}

export async function logout(): Promise<void> {
  return fetchClient<void>({
    method: "POST",
    url: apiRoute.logout,
  });
}
