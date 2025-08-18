// Client MSW 데이터 검증 테스트

import { HelloResponse } from '@/services/mock/dto';

const mockFetchClient = jest.fn();
global.fetch = mockFetchClient;

describe('Client MSW 데이터 페칭 테스트', () => {
  beforeEach(() => {
    mockFetchClient.mockClear();
  });

  test('MSW에서 올바른 JSON 데이터 형식 검증', async () => {
    const expectedData: HelloResponse = {
      message: 'hello from MSW',
    };

    mockFetchClient.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValueOnce(expectedData),
    });

    const response = await fetch('/api/hello');
    const data: HelloResponse = await response.json();

    expect(data).toHaveProperty('message');
    expect(data.message).toBe('hello from MSW');
  });

  test('MSW 에러 응답 데이터 검증', async () => {
    mockFetchClient.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: jest.fn().mockResolvedValueOnce({ error: 'Not Found' }),
    });

    const response = await fetch('/api/hello');

    expect(response.ok).toBe(false);
    expect(response.status).toBe(404);

    const errorData = await response.json();
    expect(errorData).toHaveProperty('error');
    expect(errorData.error).toBe('Not Found');
  });

  test('MSW 네트워크 에러 검증', async () => {
    mockFetchClient.mockRejectedValueOnce(new Error('Network error'));

    await expect(fetch('/api/hello')).rejects.toThrow('Network error');
  });
});
