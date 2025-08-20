// app/test-ssr/page.tsx
import { HelloResponse } from '@/services/mock/dto';
import { request } from '@/utils/api/request';

export const runtime = 'nodejs';

export default async function TestSSRPage() {
  try {
    const data = await request<HelloResponse>('GET', '/api/hello');
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  } catch (error: any) {
    return (
      <pre>
        {`ERROR\nstatus: ${error.status}\nmessage: ${error.message}\n\n`}
        {JSON.stringify(error, null, 2)}
      </pre>
    );
  }
}
