import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  'data-testid'?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, 'data-testid': testId, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}
        <input
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          data-testid={testId}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" data-testid={testId ? `${testId}-error` : undefined}>{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };