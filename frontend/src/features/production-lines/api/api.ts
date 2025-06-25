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

export const getProductionLine = async (lineId: string, token: string) => {
  const response = await api.get(`${ENDPOINT}/${lineId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
