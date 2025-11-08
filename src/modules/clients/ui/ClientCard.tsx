import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';

interface Client {
  id: number;
  name: string;
  initials: string;
  type: string;
  category: string;
  status: string;
  since: string;
  activeCases: number;
  totalRevenue: string;
  email: string;
  phone: string;
}

interface ClientCardProps {
  client: Client;
}

export function ClientCard({ client }: ClientCardProps) {
  return (
    <Link
      to={`/clients/${client.id}`}
      className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-blue-600 text-white">
            {client.initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{client.name}</h3>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                <span>{client.type}</span>
                <span>•</span>
                <span>{client.since}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {client.status}
              </Badge>
              {client.category === 'VIP' && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  ⭐ VIP
                </Badge>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-6 text-sm text-gray-600">
            <div>
              <span className="font-medium text-gray-900">{client.activeCases}</span> активных дел
            </div>
            <div>
              <span className="font-medium text-gray-900">{client.totalRevenue}</span> общий гонорар
            </div>
            <div>{client.email}</div>
            <div>{client.phone}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}
