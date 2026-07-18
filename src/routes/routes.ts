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
    magicLinkSuccess: "/auth/magic-link/success",
    twoFactorVerify: "/2fa/verify",
  },
} as const;

export const apiRoute = {} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
