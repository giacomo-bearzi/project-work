import api from '../../../utils/axios.ts';

export const getProductionLineByLineId = async (lineId: string, token: string) => {
  const response = await api.get(`/production-lines/by-line-id/${lineId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};