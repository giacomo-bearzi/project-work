import type { User } from '../../../components/Login.tsx';

export interface ApiUser {
  _id: string;
  username: string;
  role: string;
  fullName: string;
}

export interface ApiLoginResponse {
  token: string;
  user: User;
}
