import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { HttpError } from '../../../types/types';
import { getTaskByLineId, updateTask } from '../api/tasksApi';
import type { ApiUpdateTask } from '../types/tasksTypes';

export const useGetTaskByLineId = (lineId: string, status?: string, type?: string) => {
  return useQuery({
    queryKey: ['issueByLineId', lineId, status, type],
    queryFn: async () => await getTaskByLineId(lineId, status, type),
    retry: (failureCount, error) => {
      const httpError = error as HttpError;
      if (httpError.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export const useUpdateTask = (taskId: string) => {
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: async (data: ApiUpdateTask) => await updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['issueByLineId'] });
    },
  });

  return updateTaskMutation;
};
