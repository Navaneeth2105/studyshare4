import React from 'react';
import { cn } from './Button';

export function Input({ className, icon: Icon, ...props }) {
    return (
        <div className="relative group">
            {Icon && (
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Icon size={20} />
                </div>
            )}
            <input
                className={cn(
                    'w-full bg-white rounded-2xl border border-slate-200 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all shadow-sm',
                    Icon ? 'pl-11 pr-4' : 'px-4',
                    className
                )}
                {...props}
            />
        </div>
    );
}
