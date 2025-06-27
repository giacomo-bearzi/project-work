import api from '../../../utils/axios.ts';
import type { ApiIssue } from '../types/types.api.ts';

const ENDPOINT = '/issues';

export const getIssues = async (): Promise<ApiIssue[]> => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const getAssignedIssues = async (): Promise<ApiIssue[]> => {
  const response = await api.get(`${ENDPOINT}/assigned`);
  return response.data;
};

export const markAssignedIssuesAsRead = async (): Promise<void> => {
  await api.patch('/issues/assigned/mark-as-read');
};

export const hideReadAssignedIssues = async (): Promise<void> => {
  await api.patch('/issues/assigned/hide-read');
};
