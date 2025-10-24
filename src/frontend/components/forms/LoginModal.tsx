"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Modal } from "@/frontend/components/ui/Modal";
import { Input } from "@/frontend/components/ui/Input";
import { Button } from "@/frontend/components/ui/Button";
import type { LoginCredentials } from "@/shared/types";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!credentials.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      const result = await signIn("credentials", {
        username: credentials.username,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid username or password");
      } else if (result?.ok) {
        onClose();
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      setLoginError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleClose = () => {
    setCredentials({ username: "", password: "" });
    setErrors({});
    setLoginError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admin Login" data-testid="login-modal">
      <form onSubmit={handleSubmit} className="space-y-4">
        {loginError && (
          <div 
            className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/20 dark:border-red-800 dark:text-red-400"
            data-testid="login-error"
          >
            {loginError}
          </div>
        )}

        <Input
          label="Username"
          type="text"
          value={credentials.username}
          onChange={handleInputChange("username")}
          error={errors.username}
          placeholder="Enter your username"
          disabled={isLoading}
          data-testid="username-input"
        />

        <Input
          label="Password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange("password")}
          error={errors.password}
          placeholder="Enter your password"
          disabled={isLoading}
          data-testid="password-input"
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
            data-testid="close-modal"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
            data-testid="submit-login"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}