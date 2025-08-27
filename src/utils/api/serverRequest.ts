import { getServerSession } from 'next-auth';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { HttpMethod, FullRequestParams } from '@/types/api/api';
import { request } from '@/utils/api/request';

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
