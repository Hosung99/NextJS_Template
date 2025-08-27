import { useSession } from 'next-auth/react';

import { HttpMethod, FullRequestParams } from '@/types/api/api';

import { request } from './request';

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
