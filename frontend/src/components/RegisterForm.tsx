import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { RegisterCredentials } from "../types";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => void;
  isLoading?: boolean;
}

export const RegisterForm = ({
  onSubmit,
  isLoading = false,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...credentials } = data;
    onSubmit(credentials);
  };

  return (
    <div className="card max-w-md mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Full name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 dark:text-gray-200 pointer-events-none" />
            <input
              {...register("name")}
              type="text"
              id="name"
              aria-label="Full name"
              className="input-field pl-10 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all"
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {errors.name.message}
            </p>
          )}
        </div>

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
              className="input-field pl-10 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all"
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {errors.email.message}
            </p>
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
              className="input-field pl-10 pr-10 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all"
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full"
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
            Password must be at least 6 characters.
          </p>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Confirm password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-700 dark:text-gray-200 pointer-events-none" />
            <input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              aria-label="Confirm password"
              className="input-field pl-10 pr-10 focus:ring-2 focus:ring-green-400 focus:border-green-500 transition-all"
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-full"
              tabIndex={0}
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-300">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full flex items-center justify-center focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <UserPlus className="w-5 h-5 mr-2" />
          )}
          {isLoading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
};
