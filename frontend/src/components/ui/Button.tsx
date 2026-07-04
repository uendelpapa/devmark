import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";

interface ButtonProps extends Omit<HeroButtonProps, 'variant'> {
    variant?: 'primary' | 'secondary' | 'zinc' | 'onlyIcon'
}

export function Button({
    size = 'lg',
    variant = 'primary',
    className = '',
    children,
    ...props
}: ButtonProps) {

    const variants = {
        primary: 'bg-primary/50 hover:bg-primary border! border-primary text-secondary shadow-none text-base',
        secondary: 'bg-secondary hover:bg-secondary/90 text-primary-light shadow-none text-base',
        zinc: 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 shadow-none text-base',
        onlyIcon: 'size-10 bg-secondary text-primary-light cursor-pointer hover:bg-secondary/80 shadow-md shadow-black/40'
    }

    return (
        <HeroButton
            size={size}
            className={`font-medium rounded-full transition-colors ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </HeroButton>
    )
}
