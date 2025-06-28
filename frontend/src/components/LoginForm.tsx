import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { LoginCredentials } from "../types";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => void;
  isLoading?: boolean;
  hideSocial?: boolean;
}

export const LoginForm = ({ onSubmit, isLoading = false }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleFormSubmit = (data: LoginFormData) => {
    onSubmit(data);
  };

  return (
    <div className="card max-w-md mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 dark:text-gray-200 pointer-events-none" />
            <input
              {...register("email")}
              type="email"
              id="email"
              aria-label="Email address"
              className="input-field pl-10 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 dark:text-gray-200 pointer-events-none" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              id="password"
              aria-label="Password"
              className="input-field pl-10 pr-10 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition-all"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-full"
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          <div className="text-right mt-1">
            <a href="#" className="text-xs text-secondary-500 hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <LogIn className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
};
