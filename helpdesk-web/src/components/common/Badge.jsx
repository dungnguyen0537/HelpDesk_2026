import React from 'react';

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  dotColor,
  className = '',
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-primary-50 text-primary-700 border-primary-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1.5 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColor || 'bg-current'}`}
        />
      )}
      {children}
    </span>
  );
}
