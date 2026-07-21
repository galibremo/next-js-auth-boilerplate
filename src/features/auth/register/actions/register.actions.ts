import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";
import { RegisterSchemaType } from "../schemas/register-schema";

export async function register(data: RegisterSchemaType): Promise<AuthUser> {
  return fetchClient<AuthUser>({
    method: "POST",
    url: apiRoute.register,
    body: data,
  });
}
