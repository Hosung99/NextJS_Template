export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  secure?: boolean;
  query?: Record<string, any>;
  type?: ContentType;
  blob?: boolean;
  timeout?: number;
}

export interface CreateRequest extends FullRequestParams {
  path: string;
  body?: unknown;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
