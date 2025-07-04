import { useQuery } from '@tanstack/react-query';
import { getAssignedIssues, getIssueByLineId, getIssues } from '../api/issuesApi.ts';
import type { HttpError } from '../../../types/types.ts';

export const useGetIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => await getIssues(),
  });
};

export const useGetIssueByLineId = (lineId: string, status?: string, type?: string) => {
  return useQuery({
    queryKey: ['issueByLineId', lineId, status],
    queryFn: async () => await getIssueByLineId(lineId, status, type),
    retry: (failureCount, error) => {
      const httpError = error as HttpError;
      if (httpError.status === 404) return false;
      return failureCount < 3;
    },
  });
};

// Hook per le notifiche.

export const useGetAssignedIssues = () => {
  return useQuery({
    queryKey: ['assignedIssues'],
    queryFn: async () => await getAssignedIssues(),
    refetchInterval: 30000,
  });
};
