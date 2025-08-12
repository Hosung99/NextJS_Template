"use client";

import { useEffect, useState } from "react";

export default function TestClientPage() {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/hello")
      .then((res) => res.json())
      .then((json) => setData(json));
  }, []);

  return (
    <div>
      <h1>Test Client</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
