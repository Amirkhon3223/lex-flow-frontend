import { Badge } from '@/shared/ui/badge';

interface StatusBadgeProps {
    status: string;
    statusText: string;
}

export function StatusBadge({ status, statusText }: StatusBadgeProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'final':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'review':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'draft':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-blue-100 text-blue-700 border-blue-200';
        }
    };

    return (
        <Badge className={getStatusColor(status)}>
            {statusText}
        </Badge>
    );
}
