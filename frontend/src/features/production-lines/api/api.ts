import api from '../../../utils/axios.ts';

const ENDPOINT = '/production-lines';

// const delay = (s: number) => new Promise((resolve) => setTimeout(resolve, s * 1000));

export const getProductionLines = async (token: string) => {
  // await delay(5);
  const response = await api.get(ENDPOINT, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

export const getOEEData = async () => {
  const response = await api.get('/production-lines/oee/data');
  return response.data;
};

export const getLineHourlyProduction = async (lineId: string) => {
  const response = await api.get(`/production-lines/${lineId}/production/hourly`);
  return response.data;
};

export const getCombinedHourlyProduction = async () => {
  const response = await api.get('/production-lines/production/hourly/combined');
  return response.data;
};
