import api from '../../../utils/axios.ts';
import type { ApiGetLineHourlyProduction, ApiGetOEEData } from '../types/productionLinesTypes.ts';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/production-lines`;

export const getProductionLines = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const getProductionLine = async (lineId: string) => {
  const response = await api.get(`${ENDPOINT}/${lineId}`);
  return response.data;
};

export const getTotalStoppedTime = async () => {
  const response = await api.get('/production-lines/stopped-time/total');
  return response.data;
};

export const getCurrentShiftInfo = async () => {
  const response = await api.get('/production-lines/shift/info');
  return response.data;
};

export const getProductionStats = async () => {
  const response = await api.get('/production-lines/production/stats');
  return response.data;
};

export const getOEEData = async (): Promise<ApiGetOEEData> => {
  const response = await api.get('/production-lines/oee/data');
  return response.data;
};

export const getLineHourlyProduction = async (lineId: string): Promise<ApiGetLineHourlyProduction> => {
  const response = await api.get(`/production-lines/${lineId}/production/hourly`);
  return response.data;
};

export const getCombinedHourlyProduction = async () => {
  const response = await api.get('/production-lines/production/hourly/combined');
  return response.data;
};
