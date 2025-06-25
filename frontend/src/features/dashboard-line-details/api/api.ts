import api from '../../../utils/axios.ts';

export const getProductionLineById = async (id: string, token: string) => {
  const response = await api.get(`/production-lines/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};