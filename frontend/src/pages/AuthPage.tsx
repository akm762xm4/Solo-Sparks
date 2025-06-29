import { useState } from "react";
import { useLoginMutation } from "../api/authApi";
import { useRegisterMutation } from "../api/authApi";
import { useAuthStore } from "../store/authStore";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import type { LoginCredentials, RegisterCredentials } from "../types";
import { useNavigate } from "react-router-dom";
import authIllustration from "../assets/Mystic Mountain at Dawn.jpg";
import { toast } from "sonner";

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const { setUser, setToken } = useAuthStore();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setError("");
      const response = await login(credentials).unwrap();
      navigate("/dashboard");
      toast.success("Login successful, Welcome back!");
      setUser(response.data);
      if (response.token) {
        setToken(response.token);
      }
    } catch (err: any) {
      setError(err.data?.message || "Login failed. Please try again.");
    }
  };

  const handleRegister = async (credentials: RegisterCredentials) => {
    try {
      setError("");
      const response = await register(credentials).unwrap();
      navigate("/onboarding");
      toast.success("Registration successful, Welcome to Solo-Spark!");
      setUser(response.data);
      if (response.token) {
        setToken(response.token);
      }
    } catch (err: any) {
      setError(err.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F6F7] dark:bg-background-900 flex flex-col justify-between transition-colors">
      <div className="flex flex-1 items-center justify-center md:py-12 py-6">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg bg-transparent">
          {/* Left: Form Card */}
          <div className="flex-1 flex flex-col justify-center items-center bg-white dark:bg-background-800 p-10 md:p-16 transition-colors">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-2xl font-bold text-center mb-2 text-black dark:text-white">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h1>
              <p className="text-gray-500 dark:text-gray-300 text-center mb-8">
                {mode === "login"
                  ? "Login to your Solo-Spark account"
                  : "Sign up to get started with Solo-Spark"}
              </p>
              {mode === "login" ? (
                <LoginForm onSubmit={handleLogin} isLoading={isLoginLoading} />
              ) : (
                <RegisterForm
                  onSubmit={handleRegister}
                  isLoading={isRegisterLoading}
                />
              )}
              {error && (
                <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-200 text-center">
                    {error}
                  </p>
                </div>
              )}
              <div className="mt-8 text-center">
                {mode === "login" ? (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Don&apos;t have an account?{" "}
                    <button
                      className="font-semibold underline hover:text-black dark:hover:text-white transition-colors"
                      onClick={() => {
                        setMode("register");
                        setError("");
                      }}
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Already have an account?{" "}
                    <button
                      className="font-semibold underline hover:text-black dark:hover:text-white transition-colors"
                      onClick={() => {
                        setMode("login");
                        setError("");
                      }}
                    >
                      Login
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
          <img
            src={authIllustration}
            alt="Authentication illustration"
            className="w-3/4 max-w-lg h-auto object-cover hidden md:block"
            loading="lazy"
            decoding="async"
            style={{
              willChange: "transform",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden",
            }}
          />
        </div>
      </div>
      {/* Terms/Privacy Footer */}
      <footer className="w-full md:py-6 py-3 px-3 text-center text-xs text-gray-400 dark:text-gray-500 transition-colors">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </footer>
    </div>
  );
};
