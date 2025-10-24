import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  'data-testid'?: string;
}

export function Modal({ isOpen, onClose, children, title, className, size = 'md', 'data-testid': testId }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full mx-4 p-6",
          {
            'max-w-sm': size === 'sm',
            'max-w-md': size === 'md',
            'max-w-lg': size === 'lg',
            'max-w-4xl': size === 'xl',
            'max-w-6xl': size === '2xl',
          },
          className
        )}
        data-testid={testId}
      >
        {title && (
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title}
   
           </h2>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}