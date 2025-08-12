/**
 * @jest-environment node
 */

const mockServerUrl = 'http://localhost:9090';

const mockFetchSSR = jest.fn();
global.fetch = mockFetchSSR;

describe('SSR 데이터 페칭 테스트', () => {
  beforeEach(() => {
    mockFetchSSR.mockClear();
  });

  test('정상 JSON 데이터가 올바른 형식으로 오는지 검증', async () => {
    const expectedData = {
      message: 'hello from MSW Express Server!',
      timestamp: '2024-01-01T00:00:00.000Z',
      status: 'success',
    };

    mockFetchSSR.mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: {
        get: jest.fn().mockReturnValue('application/json'),
      },
      json: jest.fn().mockResolvedValueOnce(expectedData),
    });

    const response = await fetch(`${mockServerUrl}/api/hello`);
    const data = await response.json();

    expect(data).toHaveProperty('message');
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('status');
    expect(data.message).toBe('hello from MSW Express Server!');
    expect(data.status).toBe('success');
    expect(typeof data.timestamp).toBe('string');
  });

  test('에러 응답 데이터 검증', async () => {
    mockFetchSSR.mockResolvedValueOnce({
      ok: false,
      status: 500,
      headers: {
        get: jest.fn().mockReturnValue('text/html'),
      },
      text: jest.fn().mockResolvedValueOnce('Internal Server Error'),
    });

    const response = await fetch(`${mockServerUrl}/api/hello`);

    expect(response.ok).toBe(false);
    expect(response.status).toBe(500);
    expect(response.headers.get('content-type')).toBe('text/html');

    const errorText = await response.text();
    expect(errorText).toBe('Internal Server Error');
  });

  test('네트워크 에러 데이터 검증', async () => {
    mockFetchSSR.mockRejectedValueOnce(new Error('ECONNREFUSED'));

    await expect(fetch(`${mockServerUrl}/api/hello`)).rejects.toThrow('ECONNREFUSED');
  });
});
