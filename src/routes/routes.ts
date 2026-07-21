export const route = {
  public: {},
  private: {
    dashboard: "/",
    profile: "/profile",
    users: "/users",
    sessions: "/sessions",
  },
  protected: {
    login: "/login",
  },
} as const;

export const apiRoute = {
  login: "/auth/login",
  register: "/auth/register",
  googleLogin: "/auth/google",
  logout: "/auth/logout",
  users: "/users",
  user: (id: string) => `/users/${id}`,
  userRole: (id: string) => `/users/${id}/role`,
  userSessionsRevoke: (id: string) => `/users/${id}/sessions/revoke`,
  sessions: "/sessions",
  sessionRevoke: (id: string) => `/auth/sessions/${id}/revoke`,
  sessionDelete: (id: string) => `/sessions/${id}`,
  revokeOtherSessions: "/sessions/revoke-others",
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
