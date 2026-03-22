import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full rounded-lg border border-gray-300 px-3 py-2',
            'focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'placeholder:text-gray-400',
            error && 'border-danger-500 focus:border-danger-500 focus:ring-danger-200',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-danger-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
