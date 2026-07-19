import { format } from "date-fns";

import type { ManagedUser, UserRole } from "@/features/users/types/users.types";

export function formatUserDate(value: string): string {
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "Unknown";
	}

	return format(date, "MMM d, yyyy, h:mm a");
}

export function formatUserRole(role: UserRole): string {
	return role
		.toLowerCase()
		.split("_")
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

export function canManageUser(currentUser: AuthUser | null | undefined, target: ManagedUser): boolean {
	if (!currentUser || currentUser.id === target.id) return false;
	if (currentUser.role === "SUPER_ADMIN") return true;
	return false;
}

export function getAssignableRoles(currentUser: AuthUser | null | undefined): UserRole[] {
	if (!currentUser) return [];
	if (currentUser.role === "SUPER_ADMIN") return ["SUPER_ADMIN", "USER"];
	return [];
}

export function getDefaultAssignableRole(currentUser: AuthUser | null | undefined): UserRole {
	const assignableRoles = getAssignableRoles(currentUser);
	return assignableRoles.includes("USER") ? "USER" : (assignableRoles[0] ?? "USER");
}

export function formatRevokedUserSessionsCount(count: number): string {
	if (count === 0) {
		return "No active sessions to revoke";
	}

	if (count === 1) {
		return "1 session revoked";
	}

	return `${count} sessions revoked`;
}
