import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { login, logout, googleLogin } from "./login.actions";

export const useLogin = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      toast.success("Logged in successfully");
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
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    },
  });
};

export const useGoogleLogin = () => {
  const { setUser } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: googleLogin,
    onSuccess: (user) => {
      setUser(user);
      toast.success("Logged in with Google successfully");
      router.push("/");
      router.refresh();
    },
  });
};
