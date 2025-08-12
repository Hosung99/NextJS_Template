// app/test-ssr/page.tsx

export const runtime = "nodejs";

export default async function TestSSRPage() {
  // Express 모킹 서버 사용 (포트 9090)
  const mockServerUrl = 'http://localhost:9090';
  const res = await fetch(`${mockServerUrl}/api/hello`, {
    cache: "no-store",
    redirect: "manual",
  });
  const contentType = res.headers.get("content-type") ?? "";

  if (!res.ok || !contentType.includes("application/json")) {
    const text = await res.text();
    // 여기가 HTML/리다이렉트 원인 확인 포인트
    return (
      <pre>
        {`NON-JSON RESPONSE\nstatus: ${res.status}\nct: ${contentType}\nurl: ${res.url}\n\n`}
        {text.slice(0, 500)}
      </pre>
    );
  }

  const data = await res.json();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
