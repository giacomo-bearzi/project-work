import { useQuery } from '@tanstack/react-query';
import { getProductionLineByLineId } from '../api/api';

export const useProductionLine = (lineId: string, token: string) => {
  return useQuery({
    queryKey: ['productionLine', lineId],
    queryFn: () => getProductionLineByLineId(lineId, token),
    enabled: !!lineId && !!token,
  });
};