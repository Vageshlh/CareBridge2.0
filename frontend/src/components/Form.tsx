import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { useTheme } from '../context/ThemeContext';

// FormGroup component
interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

// FormLabel component
interface FormLabelProps {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export const FormLabel: React.FC<FormLabelProps> = ({ 
  htmlFor, 
  children, 
  required = false,
  className = '' 
}) => {
  const { theme } = useTheme();
  return (
    <label 
      htmlFor={htmlFor} 
      className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} ${className}`}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
};

// FormInput component
interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  touched?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  error, 
  touched = false,
  className = '',
  ...rest 
}) => {
  const hasError = error && touched;
  const { theme } = useTheme();
  
  return (
    <div>
      <input
        className={`
          block w-full rounded-md shadow-sm 
          ${hasError 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
            : theme === 'dark' 
              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} 
          sm:text-sm ${className}
        `}
        {...rest}
      />
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// FormTextarea component
interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  touched?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ 
  error, 
  touched = false,
  className = '',
  ...rest 
}) => {
  const hasError = error && touched;
  const { theme } = useTheme();
  
  return (
    <div>
      <textarea
        className={`
          block w-full rounded-md shadow-sm 
          ${hasError 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
            : theme === 'dark' 
              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} 
          sm:text-sm ${className}
        `}
        {...rest}
      />
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// FormSelect component
interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  touched?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  error, 
  touched = false,
  options,
  className = '',
  ...rest 
}) => {
  const hasError = error && touched;
  const { theme } = useTheme();
  
  return (
    <div>
      <select
        className={`
          block w-full rounded-md shadow-sm 
          ${hasError 
            ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
            : theme === 'dark' 
              ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500' 
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'} 
          sm:text-sm ${className}
        `}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// FormCheckbox component
interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  touched?: boolean;
  label: React.ReactNode;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ 
  error, 
  touched = false,
  label,
  className = '',
  ...rest 
}) => {
  const hasError = error && touched;
  
  return (
    <div>
      <div className="flex items-center">
        <input
          type="checkbox"
          className={`
            h-4 w-4 rounded 
            ${hasError 
              ? 'border-red-300 text-red-600 focus:ring-red-500' 
              : 'border-gray-300 text-primary-600 focus:ring-primary-500'} 
            ${className}
          `}
          {...rest}
        />
        <label htmlFor={rest.id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// FormRadio component
interface FormRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  touched?: boolean;
  label: React.ReactNode;
}

export const FormRadio: React.FC<FormRadioProps> = ({ 
  error, 
  touched = false,
  label,
  className = '',
  ...rest 
}) => {
  const hasError = error && touched;
  
  return (
    <div>
      <div className="flex items-center">
        <input
          type="radio"
          className={`
            h-4 w-4 
            ${hasError 
              ? 'border-red-300 text-red-600 focus:ring-red-500' 
              : 'border-gray-300 text-primary-600 focus:ring-primary-500'} 
            ${className}
          `}
          {...rest}
        />
        <label htmlFor={rest.id} className="ml-2 block text-sm text-gray-700">
          {label}
        </label>
      </div>
      {hasError && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// FormHelperText component
interface FormHelperTextProps {
  children: React.ReactNode;
  className?: string;
}

export const FormHelperText: React.FC<FormHelperTextProps> = ({ 
  children, 
  className = '' 
}) => {
  const { theme } = useTheme();
  return (
    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} ${className}`}>
      {children}
    </p>
  );
};

// FormErrorMessage component
interface FormErrorMessageProps {
  children: React.ReactNode;
  className?: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <p className={`mt-2 text-sm text-red-600 ${className}`}>
      {children}
    </p>
  );
};