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
import { useLogin } from "@/features/auth/login/actions/login.mutations";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginMode = "password" | "magic-link";

export function LoginForm() {
  const [loginMode, setLoginMode] = useState<LoginMode>("password");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<
    string | null
  >(null);

  const { mutateAsync: login, isPending: isLoggingInWithPassword } =
    useLogin();

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

      {/* <div className="space-y-4">
        <div className="flex min-h-11 w-full items-center justify-center">
          <div className="relative h-12 w-full">
            <Button
              type="button"
              disabled={isLoggingInWithPassword}
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
                  <FaGoogle className="size-5" />
                  <span className="text-sm font-semibold">
                    Continue with Google
                  </span>
                </>
              )}
            </Button>

            {!isLoggingInWithGoogle &&
              !isRequestingMagicLink &&
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

        {googleErrorMessage && (
          <p className="text-destructive text-center text-sm" role="alert">
            {googleErrorMessage}
          </p>
        )}

        <p className="text-muted-foreground text-center text-xs">
          Secure authentication powered by password, magic links, and Google
        </p>
      </div> */}
    </>
  );
}
