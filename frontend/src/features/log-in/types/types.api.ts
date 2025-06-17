export interface ApiUser {
  _id: string;
  username: string;
  role: 'operator' | 'manager' | 'admin';
  fullName: string;
}

export interface ApiLoginResponse {
  token: string;
  user: ApiUser;
}
