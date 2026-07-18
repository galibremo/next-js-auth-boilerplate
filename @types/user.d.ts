interface AuthSessionUser {
	id: string;
	publicId: string;
	name: string | null;
	email: string;
	emailVerified: boolean;
	image: string | null;
	lastLoginMethod?: string | null;
	twoFactorEnabled?: boolean;
	createdAt: string;
	updatedAt: string;
}

type AuthUser = AuthSessionUser & Partial<Omit<User, keyof AuthSessionUser>>;

interface User {
	id: string;
	publicId: string;
	name: string | null;
	email: string;
	emailVerified: boolean;
	image: string | null;
	phone: string | null;
	is2faEnabled: boolean;
	hasPassword: boolean;
	role: "ADMIN" | "MANAGER" | "USER" | "SUPER_ADMIN";
	isApproved: boolean;
	currentTeamId: string | null;
	currentTeamRole: "TEAM_LEAD" | "AGENT" | null;
	createdAt: string;
	updatedAt: string;
}
