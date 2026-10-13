import React from 'react';
import { classNames } from '../utils/helpers';
import { Search, Calendar, Clock, MapPin, User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';

const icons = {
  search: Search,
  calendar: Calendar,
  clock: Clock,
  location: MapPin,
  user: User,
  email: Mail,
  password: Lock,
  phone: Phone,
};

export function Input({ 
  label, 
  error, 
  hint, 
  leftIcon, 
  rightIcon, 
  type = 'text',
  className = '',
  inputClassName = '',
  id,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  showPasswordToggle = false,
  ...props 
}) {
  const [showPassword, setShowPassword] = React.useState(false);
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  
  const LeftIconComp = leftIcon ? icons[leftIcon] : null;
  const RightIconComp = rightIcon ? icons[rightIcon] : null;
  
  const effectiveType = type === 'password' && showPassword ? 'text' : type;
  
  return (
    <div className={classNames('input-group', className)}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative">
        {LeftIconComp && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none">
            <LeftIconComp className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={effectiveType}
          className={classNames(
            'input-field',
            LeftIconComp && 'pl-10',
            (rightIcon || showPasswordToggle) && 'pr-10',
            error && 'error',
            inputClassName
          )}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={classNames(errorId, hintId)}
          {...props}
        />
        {showPasswordToggle && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
        {RightIconComp && !showPasswordToggle && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary pointer-events-none">
            <RightIconComp className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
      </div>
      {error && (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Textarea({ 
  label, 
  error, 
  hint, 
  rows = 4,
  className = '',
  inputClassName = '',
  id,
  name,
  required = false,
  disabled = false,
  readOnly = false,
  ...props 
}) {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  
  return (
    <div className={classNames('input-group', className)}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        className={classNames('input-field', error && 'error', inputClassName)}
        disabled={disabled}
        readOnly={readOnly}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={classNames(errorId, hintId)}
        {...props}
      />
      {error && (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Select({ 
  label, 
  error, 
  hint, 
  options = [],
  placeholder = 'Chọn...',
  className = '',
  inputClassName = '',
  id,
  name,
  required = false,
  disabled = false,
  ...props 
}) {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  const hintId = hint ? `${inputId}-hint` : undefined;
  
  return (
    <div className={classNames('input-group', className)}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        id={inputId}
        name={name}
        className={classNames('input-field', error && 'error', inputClassName)}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={classNames(errorId, hintId)}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
}

export function Checkbox({ 
  label, 
  error, 
  className = '',
  id,
  name,
  required = false,
  disabled = false,
  ...props 
}) {
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;
  
  return (
    <div className={classNames('flex items-start gap-3', className)}>
      <input
        type="checkbox"
        id={inputId}
        name={name}
        className={classNames(
          'mt-1 w-4 h-4 rounded border-border text-primary',
          'focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        required={required}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={errorId}
        {...props}
      />
      <label htmlFor={inputId} className="cursor-pointer text-sm text-primary">
        {label}
      </label>
      {error && (
        <p id={errorId} className="input-error mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function RadioGroup({ 
  label, 
  error, 
  hint,
  options = [],
  className = '',
  name,
  required = false,
  disabled = false,
  ...props 
}) {
  const errorId = error ? `${name}-error` : undefined;
  const hintId = hint ? `${name}-hint` : undefined;
  
  return (
    <fieldset className={classNames('input-group', className)}>
      {label && (
        <legend className="input-label">
          {label}
          {required && <span className="text-error ml-1" aria-hidden="true">*</span>}
        </legend>
      )}
      <div className="flex flex-wrap gap-4" role="radiogroup" aria-required={required}>
        {options.map(opt => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name={name}
              value={opt.value}
              className={classNames(
                'w-4 h-4 border-border text-primary',
                'focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              disabled={disabled || opt.disabled}
              {...props}
            />
            <span className="text-sm text-primary">{opt.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p id={errorId} className="input-error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="input-hint">
          {hint}
        </p>
      )}
    </fieldset>
  );
}

export function InputGroup({ children, className = '', ...props }) {
  return (
    <div className={classNames('flex gap-2', className)} {...props}>
      {React.Children.map(children, child => 
        React.isValidElement(child) 
          ? React.cloneElement(child, { className: classNames('flex-1', child.props.className) })
          : child
      )}
    </div>
  );
}