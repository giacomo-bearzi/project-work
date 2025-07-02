import api from '../../../utils/axios.ts';
import type { ApiIssue } from '../types/types.api.ts';

const ENDPOINT = '/issues';

export const getIssues = async (): Promise<ApiIssue[]> => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

export const getIssueByLineId = async (lineId: string, status?: string, type?: string) => {
  const params = new URLSearchParams();
  
  if (status) params.append('status', status);
  if (type) params.append('type', type);
  
  const queryString = params.toString();
  const url = queryString ? `${ENDPOINT}/line/${lineId}?${queryString}` : `${ENDPOINT}/line/${lineId}`;
  
  const response = await api.get(url);
  return response.data;
};

// API per le notifiche.

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
