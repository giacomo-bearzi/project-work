import axios from "axios";
import type { User } from "../../log-in/types/types.local";
import type { Issue, Task } from "../../dashboard/pages/GestioneUtenti";
import api from "../../../utils/axios";

// Aggiungi un nuovo utente
export const addUser = async (user: Partial<User>, token: string) => {
  const res = await axios.post(`${import.meta.env.VITE_API_URL}/users`, user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Elimina un utente
export const deleteUser = async (userId: string, token: string) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_URL}/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

// Ottieni tutte le issues associate a uno username
export const getUserIssues = async (username: string): Promise<Issue[]> => {
  const res = await api.get<Issue[]>("/issues");
  return res.data.filter((issue) => issue.reportedBy.username === username);
};

// Ottieni tutte le task associate a uno username
export const getUserTasks = async (username: string): Promise<Task[]> => {
  const res = await api.get<Task[]>("/tasks");
  return res.data.filter((task) => task.assignedTo.username === username);
};
