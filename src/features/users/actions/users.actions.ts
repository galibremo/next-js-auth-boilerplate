import { fetchClient } from "@/lib/api/client";
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

export async function listUsers(filters?: UserListQuery): Promise<UserListResponse> {
  return fetchClient<UserListResponse>({
    method: "GET",
    url: apiRoute.users,
    params: createUserListQuery(filters),
  });
}

export async function getUser(id: string): Promise<ManagedUser> {
  return fetchClient<ManagedUser>({
    method: "GET",
    url: apiRoute.user(id),
  });
}

export async function createUser(data: CreateUserInput): Promise<ManagedUser> {
  return fetchClient<ManagedUser>({
    method: "POST",
    url: apiRoute.users,
    body: data,
  });
}

export async function updateUser({ id, ...data }: UpdateUserInput): Promise<ManagedUser> {
  return fetchClient<ManagedUser>({
    method: "PATCH",
    url: apiRoute.user(id),
    body: data,
  });
}

export async function updateUserRole({ id, role }: UpdateUserRoleInput): Promise<ManagedUser> {
  return fetchClient<ManagedUser>({
    method: "PATCH",
    url: apiRoute.userRole(id),
    body: { role },
  });
}

export async function deleteUser({ id }: DeleteUserInput): Promise<DeleteUserResponse> {
  return fetchClient<DeleteUserResponse>({
    method: "DELETE",
    url: apiRoute.user(id),
  });
}

export async function revokeUserSessions({ id }: RevokeUserSessionsInput): Promise<RevokeUserSessionsResponse> {
  return fetchClient<RevokeUserSessionsResponse>({
    method: "POST",
    url: apiRoute.userSessionsRevoke(id),
  });
}
