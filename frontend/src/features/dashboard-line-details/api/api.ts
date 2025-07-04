import api from '../../../utils/axios.ts';

export const getProductionLineByLineId = async (lineId: string) => {
  const response = await api.get(`/production-lines/by-line-id/${lineId}`);
  return response.data;
};
