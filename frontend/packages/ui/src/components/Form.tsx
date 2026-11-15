import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { cx } from '../utils';

export type FieldProps = { label: ReactNode; required?: boolean; hint?: ReactNode; error?: ReactNode; className?: string; children: ReactNode };

/** Campo de formulário: rótulo, controle, dica e erro (classe `.field`). */
export function Field({ label, required, hint, error, className, children }: FieldProps) {
  return (
    <div className={cx('field', error ? 'err' : '', className)}>
      <label>
        {label}
        {required && <span className="req">*</span>}
      </label>
      {children}
      {hint && <span className="hint">{hint}</span>}
      <span className="ferr">{error}</span>
    </div>
  );
}

export function Input({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cx('inp', className)} {...rest} />;
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cx('inp', className)} {...rest} />;
}

export type SelectOption = { value: string; label: string };

export function Select({ options, placeholder, className, ...rest }: SelectHTMLAttributes<HTMLSelectElement> & { options: SelectOption[]; placeholder?: string }) {
  return (
    <select className={cx('sel', className)} {...rest}>
      {placeholder != null && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
