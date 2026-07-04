import type { InputHTMLAttributes, ReactNode } from "react";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'variant' | 'className'> {
    variant?: 'zinc' | 'outline';
    className?: string;
    classNames?: {
        base?: string;
        inputWrapper?: string;
        input?: string;
    };
    icon?: ReactNode;
    endContent?: ReactNode;
}

export function Input({
    variant = 'zinc',
    classNames,
    className = '',
    icon,
    endContent,
    ...props
}: InputProps) {
    const variantClasses = {
        zinc: {
            inputWrapper: "bg-zinc-100 hover:bg-zinc-200 focus-within:!bg-zinc-200 border border-zinc-200 shadow-none rounded-full h-10 px-4 transition-colors flex items-center gap-2",
            input: "text-base text-zinc-800 placeholder:text-zinc-500 bg-transparent outline-none flex-1 min-w-0 w-full",
        },
        outline: {
            inputWrapper: "bg-transparent border border-zinc-200 focus-within:border-zinc-300 shadow-none rounded-full h-10 px-4 transition-colors flex items-center gap-2",
            input: "text-base text-zinc-800 placeholder:text-zinc-500 bg-transparent outline-none flex-1 min-w-0 w-full",
        }
    }

    const defaultClassNames = variantClasses[variant]

    // Merge custom classNames with our variant classNames
    const mergedInputWrapper = `${defaultClassNames.inputWrapper} ${classNames?.inputWrapper || ''} ${className}`.trim();
    const mergedInput = `${defaultClassNames.input} ${classNames?.input || ''}`.trim();

    return (
        <div className={mergedInputWrapper}>
            {icon}
            <input
                className={mergedInput}
                {...props}
            />
            {endContent}
        </div>
    )
}
