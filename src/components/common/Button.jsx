import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    children,
    ...props
}) {
    const variants = {
        // Primary: Indigo (Trust/Focus)
        primary: 'bg-primary-600 text-white hover:bg-primary-500 shadow-[0_4px_0_0_#312e81] hover:shadow-[0_2px_0_0_#312e81] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none',

        // Accent: Yellow (Motivation/Action) - "Karma ++"
        accent: 'bg-accent text-white hover:bg-accent-hover shadow-[0_4px_0_0_#b45309] hover:shadow-[0_2px_0_0_#b45309] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none',

        // Ghost: Subtle
        ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',

        // Outline: For secondary actions
        outline: 'border-2 border-slate-200 text-slate-700 hover:border-primary-500 hover:text-primary-600 bg-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-xs',
        md: 'px-6 py-3 text-sm',
        lg: 'px-8 py-4 text-base',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-2xl font-display font-bold transition-all duration-200 uppercase tracking-wide',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
