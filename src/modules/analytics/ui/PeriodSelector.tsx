interface PeriodSelectorProps {
    onPeriodChange?: (period: string) => void;
}

export function PeriodSelector({ onPeriodChange }: PeriodSelectorProps) {
    return (
        <select
            className="rounded-lg border px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            onChange={(e) => onPeriodChange?.(e.target.value)}
        >
            <option>Этот месяц</option>
            <option>Этот квартал</option>
            <option>Этот год</option>
        </select>
    );
}
