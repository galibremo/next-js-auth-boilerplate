import { fetchClient } from "@/lib/api/client";
import { apiRoute } from "@/routes/routes";

import { createSessionListQuery } from "@/features/sessions/schemas/sessions-api.schema";
import type {
	DeleteSessionResponse,
	RevokeOtherSessionsResponse,
	RevokeSessionResponse,
	SessionListQuery,
	SessionListResponse
} from "@/features/sessions/types/sessions.types";

export async function listSessions(filters: SessionListQuery): Promise<SessionListResponse> {
	return fetchClient<SessionListResponse>({
		method: "GET",
		url: apiRoute.sessions,
		params: createSessionListQuery(filters)
	});
}

export async function revokeSession(id: string): Promise<RevokeSessionResponse> {
	return fetchClient<RevokeSessionResponse>({
		method: "POST",
		url: apiRoute.sessionRevoke(id)
	});
}

export async function revokeOtherSessions(): Promise<RevokeOtherSessionsResponse> {
	return fetchClient<RevokeOtherSessionsResponse>({
		method: "POST",
		url: apiRoute.revokeOtherSessions
	});
}

export async function deleteSession(id: string): Promise<DeleteSessionResponse> {
	return fetchClient<DeleteSessionResponse>({
		method: "DELETE",
		url: apiRoute.sessionDelete(id)
	});
}
