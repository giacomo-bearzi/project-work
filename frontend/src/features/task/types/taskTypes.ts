import type { ApiUser } from "../../log-in/types/types.api";

export interface GetApiTask {
    assignedTo: ApiUser;
    checklist: ApiUser[];
    date: string;
    description: string;
    estimatedMinutes: number;
    lineId: string;
    status: string;
    type: 'standard' | 'manutenzione';
    maintenanceStart?: string;
    maintenanceEnd?: string;
    _id: string;
    __v: number;
}