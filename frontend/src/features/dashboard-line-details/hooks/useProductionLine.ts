import { useQuery } from '@tanstack/react-query';
import { getProductionLineById } from '../api/api';

export const useProductionLine = (id: string, token: string) => {
  return useQuery({
    queryKey: ['productionLine', id],
    queryFn: () => getProductionLineById(id, token),
    enabled: !!id && !!token,
  });
};