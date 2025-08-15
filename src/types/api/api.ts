export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  secure?: boolean;
  path: string;
  body?: unknown;
  query?: Record<string, any>;
  type?: ContentType;
  blob?: boolean;
  timeout?: number;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}
