export interface LoginResponse {
  id: string;
  username: string;
  email?: string;
  name?: string;
  accessToken: string;
  refreshToken: string;
  expireAt: number;
  role: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expireAt: number;
}
