import type { ApiGetUser } from '../../users/types/usersTypes';

export interface ApiGetChecklist {
  id: string;
  item: string;
  done: boolean;
}

export interface ApiGetTask {
  assignedTo: ApiGetUser;
  date: string;
  description: string;
  estimatedMinutes: number;
  lineId: string;
  status: string;
  type: 'standard' | 'manutenzione';
  maintenanceStart?: string;
  maintenanceEnd?: string;
  checklist: ApiGetChecklist[];
  _id: string;
  __v: number;
}

export interface ApiUpdateTask {
  date: string;
  assignedTo: ApiGetUser;
  description: string;
  estimatedMinutes: number;
  lineId: string;
  status: string;
  type: 'standard' | 'manutenzione';
  maintenanceStart?: string;
  maintenanceEnd?: string;
  checklist: ApiGetChecklist[];
}
