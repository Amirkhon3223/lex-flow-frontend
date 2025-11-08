interface DateBlockProps {
    date: string;
    time: string;
}

export function DateBlock({ date, time }: DateBlockProps) {
    const [day, month] = date.split(' ');

    return (
        <div className="flex flex-col items-center rounded-lg bg-gray-100 p-3 text-center w-16">
            <div className="text-2xl font-bold">{day}</div>
            <div className="text-xs text-gray-600">{month}</div>
            <div className="mt-1 text-xs font-medium">{time}</div>
        </div>
    );
}
