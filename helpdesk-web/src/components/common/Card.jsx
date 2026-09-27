import React from 'react';

export default function Card({
  children,
  title,
  subtitle,
  actions,
  className = '',
  bodyClassName = '',
  headerClassName = '',
}) {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {(title || subtitle || actions) && (
        <div className={`px-5 py-4 border-b border-slate-100 flex items-center justify-between ${headerClassName}`}>
          <div>
            {title && <h3 className="text-base font-semibold text-slate-800">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={`p-5 ${bodyClassName}`}>{children}</div>
    </div>
  );
}
