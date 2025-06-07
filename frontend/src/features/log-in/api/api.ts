import api from '../../../utils/axios.ts';
import type { ApiLoginResponse } from '../types/types.api.ts';
import type { LoginRequest } from '../types/types.local.ts';

const ENDPOINT = '/auth/login';

export const createLoginRequest = (data: LoginRequest) => {
  return api.post<ApiLoginResponse>(`${ENDPOINT}`, data);
};
