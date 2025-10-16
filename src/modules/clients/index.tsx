import { useQuery } from '@tanstack/react-query';
import { clientService } from '../../../app/services/clients/clientService';

export const ClientsPage = () => {
  const { data: clients, isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getAll(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading clients</div>;
  }

  return (
    <div>
      <h1>Clients</h1>
      <div>
        {clients?.map((client) => (
          <div key={client.id}>
            {client.firstName} {client.lastName}
          </div>
        ))}
      </div>
    </div>
  );
};
