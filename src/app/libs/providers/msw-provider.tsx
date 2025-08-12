"use client";

import { ReactNode, useEffect, useState } from "react";

declare global {
  interface Window {
    __MSW_BROWSER_STARTED__?: boolean;
  }
}

export default function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== "development");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    if (typeof window === "undefined") return;

    (async () => {
      if (!window.__MSW_BROWSER_STARTED__) {
        const { worker } = await import("@/mock/browser");
        await worker.start({ onUnhandledRequest: "bypass" });
        window.__MSW_BROWSER_STARTED__ = true;
      }
      setReady(true);
    })();
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
