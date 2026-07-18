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
  role: "ADMIN" | "MANAGER" | "USER" | "SUPER_ADMIN";
  createdAt: string;
  updatedAt: string;
}
