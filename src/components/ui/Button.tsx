import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  'data-testid'?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", 'data-testid': testId, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700": variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700": variant === "secondary",
            "border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800": variant === "outline",
          },
          {
            "h-9 px-3 text-sm min-w-[2.25rem]": size === "sm",
            "h-11 px-4 py-2 min-w-[2.75rem]": size === "md",
            "h-12 px-6 text-lg min-w-[3rem]": size === "lg",
          },
          className
        )}
        ref={ref}
        data-testid={testId}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };