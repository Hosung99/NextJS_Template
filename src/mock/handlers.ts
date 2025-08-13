import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('*/api/hello', () => {
    console.log('[MSW] Intercepted /api/hello request');
    return HttpResponse.json({ message: 'hello from MSW' });
  }),
];
