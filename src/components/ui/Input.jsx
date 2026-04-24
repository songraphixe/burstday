import { useState } from 'react';
import { cn } from '../../lib/utils';

export default function Input({
  label,
  error,
  success,
  className,
  inputClassName,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  required,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined ? value !== '' : false;
  const isLifted = focused || hasValue;

  return (
    <div className={cn('relative', className)}>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={isLifted ? placeholder || '' : ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          'w-full px-4 pt-6 pb-2 rounded-2xl text-white placeholder-white/30',
          'bg-white/5 border transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          focused
            ? 'border-[#FF375F] shadow-[0_0_0_2px_rgba(255,55,95,0.15)]'
            : 'border-white/10 hover:border-white/20',
          error ? 'border-red-500 shadow-[0_0_0_2px_rgba(255,55,95,0.1)]' : '',
          success ? 'border-green-500' : '',
          inputClassName
        )}
        {...props}
      />
      {label && (
        <label
          className={cn(
            'absolute left-4 transition-all duration-200 pointer-events-none',
            isLifted
              ? 'top-2 text-xs text-[#FF375F]'
              : 'top-1/2 -translate-y-1/2 text-sm text-white/40'
          )}
        >
          {label}
          {required && <span className="text-[#FF375F] ml-0.5">*</span>}
        </label>
      )}
      {success && !error && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-lg">✓</span>
      )}
      {error && (
        <p className="mt-1.5 ml-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
}
