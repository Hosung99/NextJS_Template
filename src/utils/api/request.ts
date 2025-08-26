import { getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ContentType, FullRequestParams, ApiError, HttpMethod, CreateRequest } from '@/types/api/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const buildQueryString = (query: Record<string, any>): string => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params.append(key, String(value));
    }
  });
  return params.toString();
};

const determineContentType = (body: unknown, type?: ContentType) => {
  if (type) {
    return type;
  }

  switch (true) {
    case body instanceof Blob:
      return 'application/octet-stream';
    case typeof body === 'string':
      return ContentType.Text;
    case body && typeof body === 'object':
      return ContentType.Json;
    default:
      return undefined;
  }
};

const prepareBody = (body: unknown, contentType?: string): string | FormData | Blob | undefined => {
  if (!body) {
    return undefined;
  }

  if (body instanceof FormData || body instanceof Blob) {
    return body;
  }

  if (contentType === ContentType.Json && typeof body === 'object') {
    return JSON.stringify(body);
  }

  if (contentType === ContentType.UrlEncoded && typeof body === 'object') {
    const params = new URLSearchParams();
    Object.entries(body as Record<string, any>).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, String(value));
      }
    });
    return params.toString();
  }

  return String(body);
};

const createRequest = async <T>(params: CreateRequest): Promise<T> => {
  const { path, query, body, type, blob, timeout = 10000, ...options } = params;

  // URL 구성
  let url = `${API_BASE_URL}${path}`;
  if (query) {
    const queryString = buildQueryString(query);
    if (queryString) {
    }
    url += `?${queryString}`;
  }

  // Content-Type 결정
  const contentType = determineContentType(body, type);

  // Headers 구성
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (contentType && !(body instanceof FormData)) {
    headers['Content-Type'] = contentType;
  }

  // Body 준비
  const preparedBody = prepareBody(body, contentType);

  // Timeout 처리 (서버/클라이언트 모두 적용)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Config 구성
  const config: RequestInit = {
    ...options,
    headers,
    body: preparedBody,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = `http error status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = response.statusText || errorMessage;
      }

      throw {
        message: errorMessage,
        status: response.status,
        code: response.statusText,
      } as ApiError;
    }

    // Blob 응답 처리
    if (blob) {
      return response.blob() as Promise<T>;
    }

    return await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      throw {
        message: 'Request timeout',
        status: 408,
        code: 'TIMEOUT',
      } as ApiError;
    }

    throw {
      message: error.message || 'Request failed',
      status: error.status || 500,
      code: error.code,
    } as ApiError;
  }
};

export const request = <T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: Partial<FullRequestParams>,
  token?: string,
): Promise<T> => {
  return createRequest<T>({
    path,
    method,
    body,
    ...options,
    headers: {
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

// client 컴포넌트 요청
export const useRequest = () => {
  const { data: session } = useSession();
  return <T>(
    method: HttpMethod,
    path: string,
    body?: unknown,
    options?: Partial<FullRequestParams>,
  ): Promise<T> => request<T>(method, path, body, options, session?.user?.accessToken);
};

//  server 컴포넌트 요청
export const serverRequest = async <T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: Partial<FullRequestParams>,
): Promise<T> => {
  const session = await getServerSession(authOptions);

  return request<T>(method, path, body, options, session?.user?.accessToken);
};
