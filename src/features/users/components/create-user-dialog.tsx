"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusSignCircleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useCallback, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCreateUserMutation } from "@/features/users/actions/users.mutations";
import { UserFormFields } from "@/features/users/components/user-form-fields";
import {
  CreateUserFormValues,
  createUserFormSchema,
} from "@/features/users/schemas/user-form.schema";
import {
  getAssignableRoles,
  getDefaultAssignableRole,
} from "@/features/users/utils/user-format";
import { useAuth } from "@/hooks/use-auth";

export function CreateUserDialog() {
  const { user: currentUser } = useAuth();
  const createUserMutation = useCreateUserMutation();
  const assignableRoles = useMemo(
    () => getAssignableRoles(currentUser),
    [currentUser],
  );
  const [open, setOpen] = useState(false);

  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: createInitialValues(currentUser),
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      form.reset(createInitialValues(currentUser));
    }

    setOpen(nextOpen);
  };

  const onSubmit = useCallback(
    (values: CreateUserFormValues) => {
      createUserMutation.mutate(
        {
          name: emptyToNull(values.name),
          email: values.email.trim().toLowerCase(),
          password: emptyToNull(values.password),
          emailVerified: values.emailVerified,
          role: values.role,
        },
        {
          onSuccess: () => {
            toast.success("User created");
            setOpen(false);
          },
          onError: (error) => {
            toast.error("Failed to create user");
            console.log(error);
          },
        },
      );
    },
    [createUserMutation],
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        onClick={() => handleOpenChange(true)}
        disabled={assignableRoles.length === 0}
      >
        <HugeiconsIcon icon={PlusSignCircleIcon} data-icon="inline-start" />
        Create user
      </Button>
      <DialogContent className="sm:max-w-2xl">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6">
            <DialogHeader>
              <DialogTitle>Create user</DialogTitle>
              <DialogDescription>
                Add a managed account with the allowed role hierarchy.
              </DialogDescription>
            </DialogHeader>
            <UserFormFields
              idPrefix="create-user"
              roleOptions={assignableRoles}
              showPassword
              showRole
              disabled={createUserMutation.isPending}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? "Creating" : "Create user"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

function createInitialValues(
  currentUser: AuthUser | null | undefined,
): CreateUserFormValues {
  return {
    name: "",
    email: "",
    password: "",
    role: getDefaultAssignableRole(currentUser),
    emailVerified: false,
  };
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed || null;
}
