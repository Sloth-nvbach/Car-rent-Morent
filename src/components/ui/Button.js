import React from 'react';
import { classNames } from '../utils/helpers';
import { Loader2 } from 'lucide-react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  type = 'button',
  className = '',
  onClick,
  ...props 
}) {
  const baseClasses = 'btn transition';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };
  const widthClass = fullWidth ? 'btn-full' : '';
  
  return (
    <button
      type={type}
      className={classNames(baseClasses, variantClasses[variant], sizeClasses[size], widthClass, className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
      ) : (
        <>
          {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
          {children}
          {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

export function ButtonGroup({ children, className = '', ...props }) {
  return (
    <div className={classNames('flex gap-2', className)} role="group" {...props}>
      {children}
    </div>
  );
}