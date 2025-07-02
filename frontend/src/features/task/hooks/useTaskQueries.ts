import { useQuery } from "@tanstack/react-query";
import type { HttpError } from "../../../types/types";
import { getTaskByLineId } from "../api/taskApi";

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