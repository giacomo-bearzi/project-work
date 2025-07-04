import type { ApiGetUser } from "../features/users/types/usersTypes";

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const formatted = date.toLocaleString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatted.replace(/\//g, '-').replace(', ', ' ');
};

export const extractTime = (dateString: string): string => {
  const date = new Date(dateString);

  const formatted = date.toLocaleString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return formatted.replace(/\//g, '-').replace(', ', ' ');
};

// Ritorna il colore in base al livello di OEE.
export const getOEEStatusColor = (status: 'excellent' | 'good' | 'critical'): string => {
  switch (status) {
    case 'excellent':
      return '#4CAF50'; // Verde
    case 'good':
      return '#FF9800'; // Arancione
    case 'critical':
      return '#F44336'; // Rosso
    default:
      return '#757575'; // Grigio
  }
}

export const getUserRole = (role: ApiGetUser['role']): string => {
  switch (role) {
    case 'admin':
      return 'Amministratore';
    case 'manager':
      return 'Manager';
    default:
      return 'Operatore';
  }
};