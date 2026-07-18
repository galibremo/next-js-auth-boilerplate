import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { register } from "./register.actions";

export const useRegister = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation<
    AuthUser,
    Error,
    { name: string; email: string; password: string }
  >({
    mutationFn: register,
    onSuccess: (user) => {
      setUser(user);
      router.push("/");
      router.refresh();
    },
  });
};
