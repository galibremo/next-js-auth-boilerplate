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
  users: "/users",
  user: (id: string) => `/users/${id}`,
  userRole: (id: string) => `/users/${id}/role`,
  userSessionsRevoke: (id: string) => `/users/${id}/sessions/revoke`,
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
