import React from 'react';
import { cn } from './Button';

export function Card({ className, children, hover = true, reaction, ...props }) {
    return (
        <div
            className={cn(
                'relative bg-white rounded-3xl border-2 border-slate-100 p-6',
                hover && 'hover:border-primary-200 hover:shadow-xl hover:-rotate-1 transition-all duration-300',
                className
            )}
            {...props}
        >
            {reaction && (
                <div className="absolute -top-3 -right-3 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded-full text-xl animate-bounce-slight">
                    {reaction}
                </div>
            )}
            {children}
        </div>
    );
}

export function Badge({ className, variant = 'blue', children }) {
    const variants = {
        blue: 'bg-primary-50 text-primary-600 border-primary-100',
        green: 'bg-secondary-50 text-secondary-600 border-secondary-100',
        yellow: 'bg-accent-light text-accent-hover border-accent-light',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border',
                variants[variant],
                className
            )}
        >
            {children}
        </span>
    );
}
