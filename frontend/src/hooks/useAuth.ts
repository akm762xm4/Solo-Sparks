import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useGetCurrentUserQuery, useLogoutMutation } from "../api/authApi";

export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    setUser,
    setLoading,
    logout: logoutStore,
  } = useAuthStore();
  const { data: userData, isLoading: isLoadingUser } = useGetCurrentUserQuery(
    undefined,
    {
      skip: !isAuthenticated,
    }
  );
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    if (userData?.data) {
      setUser(userData.data);
    }
  }, [userData, setUser]);

  useEffect(() => {
    setLoading(isLoadingUser);
  }, [isLoadingUser, setLoading]);

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      logoutStore();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
};
