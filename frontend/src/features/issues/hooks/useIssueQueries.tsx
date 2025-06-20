import { useQuery } from '@tanstack/react-query';
import { getAssignedIssues, getIssues } from '../api/api.ts';

export const useGetIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => await getIssues(),
  });
};

export const useGetAssignedIssues = () => {
  return useQuery({
    queryKey: ['assignedIssues'],
    queryFn: async () => await getAssignedIssues(),
    refetchInterval: 30000,
  });
};
