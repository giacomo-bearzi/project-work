import api from '../../../utils/axios.ts';
import type { ApiGetIssue } from '../../issues/types/issuesTypes.ts';
import type { ApiGetTask } from '../../tasks/types/tasksTypes.ts';
import type {
  ApiCreateLoginRequest,
  ApiCreateUser,
  ApiGetLoginResponse,
} from '../types/usersTypes.ts';

const ENDPOINT_LOGIN = `${import.meta.env.VITE_API_URL}/auth/login`;

const ENDPOINT_USERS = `${import.meta.env.VITE_API_URL}/users`;

export const createLoginRequest = (data: ApiCreateLoginRequest) => {
  return api.post<ApiGetLoginResponse>(ENDPOINT_LOGIN, data);
};

// Aggiungi un nuovo utente
export const addUser = async (user: ApiCreateUser) => {
  const res = await api.post(ENDPOINT_USERS, user);
  return res.data;
};

// Elimina un utente
export const deleteUser = async (userId: string) => {
  const res = await api.delete(`${ENDPOINT_USERS}/${userId}`);
  return res.data;
};

// Ottieni tutte le issues associate a uno username
export const getUserIssues = async (username: string): Promise<ApiGetIssue[]> => {
  const res = await api.get<ApiGetIssue[]>('/issues');
  return res.data.filter((issue) => issue.reportedBy.username === username);
};

// Ottieni tutte le task associate a uno username
export const getUserTasks = async (username: string): Promise<ApiGetTask[]> => {
  const res = await api.get<ApiGetTask[]>('/tasks');
  return res.data.filter((task) => task.assignedTo.username === username);
};
