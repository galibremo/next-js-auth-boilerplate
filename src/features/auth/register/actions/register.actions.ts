import { fetchClient } from "@/lib/api/client";
import { RegisterSchemaType } from "../schemas/register-schema";

export async function register(data: RegisterSchemaType) {
  const res = await fetchClient("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}
