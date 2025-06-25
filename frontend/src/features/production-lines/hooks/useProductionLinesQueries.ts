import { useQuery } from '@tanstack/react-query';
import { getProductionLine, getProductionLines } from '../api/api.ts';

export const useGetProductionLines = (token: string) => {
  return useQuery({
    queryKey: ['productionLines'],
    queryFn: async () => await getProductionLines(token),
  });
};

export const useGetProductionLine = (lineId: string, token: string) => {
  return useQuery({
    queryKey: ['productionLine', lineId],
    queryFn: async () => await getProductionLine(lineId, token),
  });
};
