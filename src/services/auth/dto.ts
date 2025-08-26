export interface LoginResponse {
  id: string;
  username: string;
  email?: string;
  name?: string;
  accessToken: string;
  refreshToken: string;
  role: string;
}
