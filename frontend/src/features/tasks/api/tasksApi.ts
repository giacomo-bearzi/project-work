import api from '../../../utils/axios.ts';
import type { ApiUpdateTask } from '../types/tasksTypes.ts';

const ENDPOINT = `${import.meta.env.VITE_API_URL}/tasks`;

export const getTaskByLineId = async (lineId: string, status?: string, type?: string) => {
  const params = new URLSearchParams();

  if (status) params.append('status', status);
  if (type) params.append('type', type);

  const queryString = params.toString();
  const url = queryString
    ? `${ENDPOINT}/line/${lineId}?${queryString}`
    : `${ENDPOINT}/line/${lineId}`;

  const response = await api.get(url);
  return response.data;
};

export const updateTask = async (taskId: string, data: ApiUpdateTask) => {
  const response = await api.put(`${ENDPOINT}/${taskId}`, data);
  return response.data;
};
