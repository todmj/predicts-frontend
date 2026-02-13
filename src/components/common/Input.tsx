import { InputHTMLAttributes, useId } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  dark?: boolean;
}

export const Input = ({ label, error, hint, className = '', id: providedId, dark = false, ...props }: InputProps) => {
  const generatedId = useId();
  const inputId = providedId || generatedId;

  const lightStyles = `
    bg-white border border-[#E5E5E5] rounded-lg
    text-[#1C1526] placeholder-[#767771] text-sm
    focus:outline-none focus:border-[#3D0C63] focus:ring-2 focus:ring-[#3D0C63]/20
  `;

  const darkStyles = `
    bg-[#080018] border border-white/10 rounded-lg
    text-[#EAEAF0] placeholder-[#767771] text-sm
    focus:outline-none focus:border-[#C6FF2F] focus:ring-2 focus:ring-[#C6FF2F]/20
  `;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-xs uppercase tracking-wider mb-2 font-semibold ${dark ? 'text-[#EAEAF0]' : 'text-[#1C1526]'}`}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          block w-full px-4 py-3
          ${dark ? darkStyles : lightStyles}
          transition-all duration-150
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1 font-medium">
          {error}
        </p>
      )}
      {hint && !error && (
        <p className={`mt-1.5 text-xs ${dark ? 'text-[#767771]' : 'text-[#767771]'}`}>{hint}</p>
      )}
    </div>
  );
};

export default Input;

