export interface ApiCreateLoginRequest {
  username: string;
  password: string;
}

export interface ApiGetLoginResponse {
  user: ApiGetUser;
  token: string;
}

export interface ApiGetUser {
  _id: string;
  username: string;
  role: 'operator' | 'manager' | 'admin';
  fullName: string;
}

export interface ApiCreateUser {
  username: string;
  password: string;
  role: 'operator' | 'manager' | 'admin';
  fullName: string;
}
