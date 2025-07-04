import { useQuery } from '@tanstack/react-query';
import { getProductionLineByLineId } from '../api/api';

export const useProductionLine = (lineId: string) => {
  return useQuery({
    queryKey: ['productionLine', lineId],
    queryFn: () => getProductionLineByLineId(lineId),
    enabled: !!lineId,
  });
};
