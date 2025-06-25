import type { ApiUser } from '../../log-in/types/types.api.ts';

export interface ApiIssue {
  _id: string;
  lineId: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  reportedBy: ApiUser;
  assignedTo: ApiUser;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
