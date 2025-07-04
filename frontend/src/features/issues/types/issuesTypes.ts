import type { ApiGetUser } from '../../users/types/usersTypes';

export interface ApiGetIssue {
  _id: string;
  lineId: string;
  type: string;
  priority: string;
  status: string;
  description: string;
  reportedBy: ApiGetUser;
  assignedTo: ApiGetUser;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
