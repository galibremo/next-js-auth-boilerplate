import { fetchClient } from "@/lib/api/client";
import { LoginSchemaType } from "../schemas/login-schema";

export async function login(data: LoginSchemaType) {
  const res = await fetchClient("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function googleLogin(idToken: string) {
  const res = await fetchClient("/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
  const json = await res.json();
  return json.data;
}

export async function logout() {
  return await fetchClient("/auth/logout", {
    method: "POST",
  });
}
