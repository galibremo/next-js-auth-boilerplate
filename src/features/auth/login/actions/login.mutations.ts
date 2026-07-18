import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { login, logout } from "./login.actions";

export const useLogin = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      router.push("/");
      router.refresh();
    },
  });
};

export const useLogout = () => {
  const { setUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setUser(null);
      queryClient.clear();
      router.push("/login");
      router.refresh();
    },
  });
};
