'use client';

import { useEffect, useState } from 'react';
import { HelloResponse } from '@/services/mock/dto';
import { request } from '@/utils/api/request';

export default function TestClientPage() {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    request<HelloResponse>('GET', '/api/hello')
      .then((response) => setData(response))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <h1>Test Client</h1>
      {error ? (
        <pre style={{ color: 'red' }}>Error: {error}</pre>
      ) : (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  );
}
