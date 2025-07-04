import { useQuery } from '@tanstack/react-query';
import {
  getProductionLine,
  getProductionLines,
  getProductionStats,
  getTotalStoppedTime,
  getCurrentShiftInfo,
  getLineHourlyProduction,
  getCombinedHourlyProduction,
  getOEEData,
} from '../api/productionLinesApi.ts';

export const useGetProductionLines = () => {
  return useQuery({
    queryKey: ['productionLines'],
    queryFn: async () => await getProductionLines(),
  });
};

export const useGetProductionLine = (idProdctionLine: string) => {
  return useQuery({
    queryKey: ['productionLine', idProdctionLine],
    queryFn: async () => await getProductionLine(idProdctionLine),
  });
};

export const useGetTotalStoppedTime = () => {
  return useQuery({
    queryKey: ['totalStoppedTime'],
    queryFn: async () => await getTotalStoppedTime(),
    refetchInterval: 10000,
  });
};

export const useGetCurrentShiftInfo = () => {
  return useQuery({
    queryKey: ['currentShiftInfo'],
    queryFn: async () => await getCurrentShiftInfo(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useGetProductionStats = () => {
  return useQuery({
    queryKey: ['productionStats'],
    queryFn: () => getProductionStats(),
    refetchInterval: 10000,
  });
};

export const useGetLineHourlyProduction = (lineId: string) => {
  return useQuery({
    queryKey: ['lineHourlyProduction', lineId],
    queryFn: () => getLineHourlyProduction(lineId),
    refetchInterval: 30000,
  });
};

export const useGetCombinedHourlyProduction = () => {
  return useQuery({
    queryKey: ['combinedHourlyProduction'],
    queryFn: () => getCombinedHourlyProduction(),
    refetchInterval: 30000,
  });
};

export const useGetOEEData = () => {
  return useQuery({
    queryKey: ['oeeData'],
    queryFn: getOEEData,
    refetchInterval: 30000,
  });
}