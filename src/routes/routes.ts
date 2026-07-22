export const route = {
  public: {},
  private: {
    dashboard: "/",
    profile: "/profile",
    users: "/users",
    sessions: "/sessions",
    emailProviders: "/email-providers",
    emailTemplates: "/email-templates",
    emailTemplateEdit: (publicId: string) =>
      `/email-templates/${publicId}/edit`,
    emailLogs: "/email-logs",
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
  sessionRevoke: (id: string) => `/sessions/${id}/revoke`,
  sessionDelete: (id: string) => `/sessions/${id}`,
  revokeOtherSessions: "/sessions/revoke-others",

  me: "/auth/session",
  profile: "/auth/profile",
  profileImage: "/auth/profile/image",

  setPassword: "/auth/set-password",
  changePassword: "/auth/change-password",
  emailProviders: "/email-providers",
  emailProvider: (id: string) => `/email-providers/${id}`,
  emailProviderTest: (id: string) => `/email-providers/${id}/test`,
  emailProviderSetDefault: (id: string) => `/email-providers/${id}/set-default`,
  emailProviderToggle: (id: string) => `/email-providers/${id}/toggle`,
  emailTemplates: "/email-templates",
  emailTemplate: (publicId: string) => `/email-templates/${publicId}`,
  emailLogs: "/email-logs",
  emailLog: (logId: string) => `/email-logs/${logId}`,
  emailLogResend: (logId: string) => `/email-logs/${logId}/resend`,
} as const;

const DEFAULT_LOGIN_REDIRECT = route.private.dashboard;

const appRoutePrefix = process.env.NEXT_PUBLIC_FRONTEND_URL;
const apiRoutePrefix = process.env.NEXT_PUBLIC_API_URL;

export { apiRoutePrefix, appRoutePrefix, DEFAULT_LOGIN_REDIRECT };
