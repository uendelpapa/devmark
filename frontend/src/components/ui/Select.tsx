import { Funnel } from '@gravity-ui/icons'
import { Select as HeroSelect, ListBox } from '@heroui/react'
import type { ReactNode } from 'react'

type Key = string | number

export type SelectVariant = 'zinc' | 'outline' | 'primary'

export interface SelectProps {
    children: ReactNode
    selectedKey?: Key | null
    onSelectionChange?: (key: Key | null) => void
    ariaLabel?: string
    placeholder?: string
    className?: string
    triggerClassName?: string
    variant?: SelectVariant
}

export function Select({
    children,
    selectedKey,
    onSelectionChange,
    ariaLabel = 'Selecione',
    placeholder,
    className = '',
    triggerClassName = '',
    variant = 'zinc'
}: SelectProps) {
    const variantClasses = {
        zinc: 'bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 rounded-full pl-4 shadow-none text-lg text-zinc-700 font-medium w-fit ',
        outline: '',
        primary: 'bg-primary/50 hover:bg-primary border border-primary rounded-full pl-4 shadow-none text-lg text-secondary font-medium w-fit cursor-pointer '
    }

    const iconColors = {
        zinc: 'text-zinc-700',
        outline: 'text-zinc-500',
        primary: 'text-secondary'
    }

    return (
        <HeroSelect
            aria-label={ariaLabel}
            selectedKey={selectedKey}
            onSelectionChange={onSelectionChange}
            className={`shrink-0 ${className}`}
            placeholder={placeholder}
        >
            <HeroSelect.Trigger className={`${variantClasses[variant]} flex items-center gap-1 ${triggerClassName}`}>
                <Funnel className={`size-4 ${iconColors[variant]}`} />
                <HeroSelect.Value className="text-base font-medium" />
                <HeroSelect.Indicator />
            </HeroSelect.Trigger>
            <HeroSelect.Popover className="bg-white border border-zinc-200 rounded-3xl z-[120] shadow-lg">
                <ListBox className="p-2 max-h-[300px] overflow-y-auto scrollbar-none">
                    {children}
                </ListBox>
            </HeroSelect.Popover>
        </HeroSelect>
    )
}

export interface SelectItemProps {
    id: string | number
    children: ReactNode
    textValue?: string
    className?: string
}

export function SelectItem({ id, children, textValue, className = '' }: SelectItemProps) {
    return (
        <ListBox.Item
            id={id}
            textValue={textValue || (typeof children === 'string' ? children : String(id))}
            className={`text-base ${className}`}
        >
            {children}
        </ListBox.Item>
    )
}