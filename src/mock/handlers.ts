import { http, HttpResponse } from 'msw';

import { HelloResponse } from '@/services/mock/dto';

export const handlers = [
  http.get('*/api/hello', () => {
    console.log('[MSW] Intercepted /api/hello request');
    const response: HelloResponse = { message: 'hello from MSW' };
    return HttpResponse.json(response);
  }),
];
