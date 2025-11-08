import { FileText, Star, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from './StatusBadge';

interface DocumentCardProps {
    id: number;
    title: string;
    case: string;
    author: string;
    type: string;
    size: string;
    date: string;
    versions: number;
    status: string;
    statusText: string;
    favorite: boolean;
}

export function DocumentCard({
    id,
    title,
    case: caseName,
    author,
    type,
    size,
    date,
    versions,
    status,
    statusText,
    favorite,
}: DocumentCardProps) {
    return (
        <Link
            to={`/documents/${id}`}
            className="flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50"
        >
            {}
            <div className="rounded-lg bg-blue-50 p-3">
                <FileText className="h-6 w-6 text-blue-600" />
            </div>

            {}
            <div className="flex-1">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900">{title}</h3>
                            {favorite && (
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                            <span>📁 {caseName}</span>
                            <span>•</span>
                            <span>👤 {author}</span>
                            <span>•</span>
                            <span>📄 {type}</span>
                        </div>
                    </div>
                    <StatusBadge status={status} statusText={statusText} />
                </div>
            </div>

            {}
            <div className="flex items-center gap-6 text-sm text-gray-600">
                <div>{size}</div>
                <div>{date}</div>
                <div className="flex items-center gap-1">
                    <Archive className="h-4 w-4" />
                    {versions}
                </div>
            </div>
        </Link>
    );
}
