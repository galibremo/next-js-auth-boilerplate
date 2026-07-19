"use client";

import {
  Loading03Icon,
  LockSync01Icon,
  Mail01Icon,
  MailSend01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
  loginSchema,
  type LoginSchemaType,
} from "@/features/auth/login/schemas/login-schema";
import { useLogin, useGoogleLogin } from "@/features/auth/login/actions/login.mutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";

type LoginMode = "password" | "magic-link";

export function LoginForm() {
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >(null);
  const [googleErrorMessage, setGoogleErrorMessage] = useState<string | null>(null);

  const { mutateAsync: login, isPending: isLoggingInWithPassword } =
    useLogin();
  const { mutateAsync: loginWithGoogle, isPending: isLoggingInWithGoogle } = useGoogleLogin();

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setGoogleErrorMessage(null);
    if (credentialResponse.credential) {
      try {
        await loginWithGoogle(credentialResponse.credential);
      } catch (error) {
        setGoogleErrorMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        );
      }
    }
  };

  const handleGoogleError = () => {
    setGoogleErrorMessage("Google login failed. Please try again.");
  };

  const { control: passwordControl, handleSubmit: handleSubmitPassword } =
    useForm<LoginSchemaType>({
      resolver: zodResolver(loginSchema),
      defaultValues: { email: "", password: "" },
    });

  const handlePasswordSubmit = async (values: LoginSchemaType) => {
    setPasswordErrorMessage(null);
    try {
      await login(values);
    } catch (error) {
      setPasswordErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="mb-4 flex gap-2">
        <Button
          type="button"
          variant={loginMode === "password" ? "default" : "outline"}
          className="flex-1 rounded-xl"
          onClick={() => setLoginMode("password")}
        >
          <HugeiconsIcon icon={LockSync01Icon} className="mr-2 size-4" />
          Password
        </Button>
        <Button
          type="button"
          variant={loginMode === "magic-link" ? "default" : "outline"}
          className="flex-1 rounded-xl"
          onClick={() => setLoginMode("magic-link")}
        >
          <HugeiconsIcon icon={MailSend01Icon} className="mr-2 size-4" />
          Magic Link
        </Button>
      </div>

      {loginMode === "password" && (
        <form
          className="space-y-4"
          onSubmit={handleSubmitPassword(handlePasswordSubmit)}
          noValidate
        >
          <Controller
            name="email"
            control={passwordControl}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password-email">Email address</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={Mail01Icon}
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    />
                    <Input
                      id="password-email"
                      type="email"
                      {...field}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-12 rounded-xl pl-10"
                      disabled={isLoggingInWithPassword}
                    />
                  </div>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            name="password"
            control={passwordControl}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <FieldContent>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={LockSync01Icon}
                      className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                    />
                    <Input
                      id="password"
                      type="password"
                      {...field}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="h-12 rounded-xl pl-10"
                      disabled={isLoggingInWithPassword}
                    />
                  </div>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </FieldContent>
              </Field>
            )}
          />

          <Button
            type="submit"
            className="h-12 w-full justify-center gap-3 rounded-xl px-4"
            disabled={isLoggingInWithPassword}
          >
            {isLoggingInWithPassword ? (
              <>
                <HugeiconsIcon
                  icon={Loading03Icon}
                  className="size-4 animate-spin"
                />
                <span className="text-sm font-semibold">Signing in...</span>
              </>
            ) : (
              <>
                <HugeiconsIcon icon={UserCircleIcon} className="size-4" />
                <span className="text-sm font-semibold">
                  Sign in with password
                </span>
              </>
            )}
          </Button>
        </form>
      )}

      {passwordErrorMessage && (
        <p className="text-destructive text-center text-sm" role="alert">
          {passwordErrorMessage}
        </p>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="bg-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-3 font-medium">
            Or continue with
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}>
          <div className="flex min-h-11 w-full items-center justify-center">
            <div className="relative h-12 w-full">
              <Button
                type="button"
                disabled={isLoggingInWithPassword || isLoggingInWithGoogle}
                className="pointer-events-none h-12 w-full justify-center gap-3 rounded-xl px-4"
              >
                {isLoggingInWithGoogle ? (
                  <>
                    <HugeiconsIcon
                      icon={Loading03Icon}
                      className="size-4 animate-spin"
                    />
                    <span className="text-sm font-semibold">
                      Signing you in...
                    </span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="size-5">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    <span className="text-sm font-semibold">
                      Continue with Google
                    </span>
                  </>
                )}
              </Button>

              {!isLoggingInWithGoogle &&
                !isLoggingInWithPassword && (
                  <div className="absolute inset-0 overflow-hidden rounded-xl opacity-0">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      text="signin_with"
                      theme="outline"
                      size="large"
                      shape="rectangular"
                      width="390"
                      use_fedcm_for_button={false}
                      use_fedcm_for_prompt={false}
                    />
                  </div>
                )}
            </div>
          </div>
        </GoogleOAuthProvider>

        {googleErrorMessage && (
          <p className="text-destructive text-center text-sm" role="alert">
            {googleErrorMessage}
          </p>
        )}

        <p className="text-muted-foreground text-center text-xs">
          Secure authentication powered by password, magic links, and Google
        </p>
      </div>
    </>
  );
}
