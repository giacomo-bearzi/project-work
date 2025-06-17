import { useQuery } from '@tanstack/react-query';
import { getIssues } from '../api/api.ts';

export const useGetIssues = () => {
  return useQuery({
    queryKey: ['issues'],
    queryFn: async () => await getIssues(),
  });
};
