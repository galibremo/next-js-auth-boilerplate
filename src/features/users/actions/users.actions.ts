import { createUserListQuery } from "@/features/users/schemas/users-api.schema";
import type {
  CreateUserInput,
  DeleteUserInput,
  DeleteUserResponse,
  ManagedUser,
  RevokeUserSessionsInput,
  RevokeUserSessionsResponse,
  UpdateUserInput,
  UpdateUserRoleInput,
  UserListQuery,
  UserListResponse,
} from "@/features/users/types/users.types";
import { apiRoute } from "@/routes/routes";

import { fetchClient } from "@/lib/api/client";

export async function listUsers(
  filters?: UserListQuery,
): Promise<UserListResponse> {
  const params = createUserListQuery(filters);
  const queryParams = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  
  const res = await fetchClient(`${apiRoute.users}${queryParams ? `?${queryParams}` : ""}`, {
    method: "GET",
  });
  const json = await res.json();
  return json.data;
}

export async function getUser(id: string): Promise<ManagedUser> {
  const res = await fetchClient(apiRoute.user(id), {
    method: "GET",
  });
  const json = await res.json();
  return json.data;
}

export async function createUser(data: CreateUserInput): Promise<ManagedUser> {
  const res = await fetchClient(apiRoute.users, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function updateUser({
  id,
  ...data
}: UpdateUserInput): Promise<ManagedUser> {
  const res = await fetchClient(apiRoute.user(id), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  const json = await res.json();
  return json.data;
}

export async function updateUserRole({
  id,
  role,
}: UpdateUserRoleInput): Promise<ManagedUser> {
  const res = await fetchClient(apiRoute.userRole(id), {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
  const json = await res.json();
  return json.data;
}

export async function deleteUser({
  id,
}: DeleteUserInput): Promise<DeleteUserResponse> {
  const res = await fetchClient(apiRoute.user(id), {
    method: "DELETE",
  });
  const json = await res.json();
  return json.data;
}

export async function revokeUserSessions({
  id,
}: RevokeUserSessionsInput): Promise<RevokeUserSessionsResponse> {
  const res = await fetchClient(apiRoute.userSessionsRevoke(id), {
    method: "POST",
  });
  const json = await res.json();
  return json.data;
}
