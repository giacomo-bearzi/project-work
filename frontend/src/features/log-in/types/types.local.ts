import type { ApiUser } from './types.api.ts';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface User extends ApiUser {
  formattedRole: 'Operatore' | 'Dirigente' | 'Amministratore';
}

const mapApiUserRole = (apiRole: ApiUser['role']): User['formattedRole'] => {
  switch (apiRole) {
    case 'manager':
      return 'Dirigente';
    case 'admin':
      return 'Amministratore';
    default:
      return 'Operatore';
  }
};

export const mapApiUser = (apiReponse: ApiUser): User => {
  return {
    ...apiReponse,
    formattedRole: mapApiUserRole(apiReponse.role),
  };
};
