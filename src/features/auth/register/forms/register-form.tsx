"use client";

import {
  Loading03Icon,
  LockSync01Icon,
  Mail01Icon,
  UserCircleIcon,
  UserMultiple02Icon,
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
  registerSchema,
  type RegisterSchemaType,
} from "@/features/auth/register/schemas/register-schema";
import { useRegister } from "@/features/auth/register/actions/register.mutations";
import { zodResolver } from "@hookform/resolvers/zod";

export function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: registerUser, isPending } = useRegister();

  const { control, handleSubmit } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleRegisterSubmit = async (values: RegisterSchemaType) => {
    setErrorMessage(null);
    try {
      await registerUser(values);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(handleRegisterSubmit)}
      noValidate
    >
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="register-name">Name</FieldLabel>
            <FieldContent>
              <div className="relative">
                <HugeiconsIcon
                  icon={UserMultiple02Icon}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                />
                <Input
                  id="register-name"
                  type="text"
                  {...field}
                  placeholder="John Doe"
                  autoComplete="name"
                  className="h-12 rounded-xl pl-10"
                  disabled={isPending}
                />
              </div>
              <FieldError>{fieldState.error?.message}</FieldError>
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="register-email">Email address</FieldLabel>
            <FieldContent>
              <div className="relative">
                <HugeiconsIcon
                  icon={Mail01Icon}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                />
                <Input
                  id="register-email"
                  type="email"
                  {...field}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-12 rounded-xl pl-10"
                  disabled={isPending}
                />
              </div>
              <FieldError>{fieldState.error?.message}</FieldError>
            </FieldContent>
          </Field>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor="register-password">Password</FieldLabel>
            <FieldContent>
              <div className="relative">
                <HugeiconsIcon
                  icon={LockSync01Icon}
                  className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                />
                <Input
                  id="register-password"
                  type="password"
                  {...field}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="h-12 rounded-xl pl-10"
                  disabled={isPending}
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
        disabled={isPending}
      >
        {isPending ? (
          <>
            <HugeiconsIcon
              icon={Loading03Icon}
              className="size-4 animate-spin"
            />
            <span className="text-sm font-semibold">Creating account...</span>
          </>
        ) : (
          <>
            <HugeiconsIcon icon={UserCircleIcon} className="size-4" />
            <span className="text-sm font-semibold">Create account</span>
          </>
        )}
      </Button>

      {errorMessage && (
        <p className="text-destructive text-center text-sm" role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
