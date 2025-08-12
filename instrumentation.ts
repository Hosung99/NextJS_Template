export const runtime = "nodejs";

export async function register() {
  // dev에서만
  if (process.env.NODE_ENV !== "development") {
    console.log("[MSW] Skipping MSW in production");
    return;
  }

  // 중복 실행 방지
  if ((globalThis as any).__MSW_NODE_STARTED__) {
    console.log("[MSW] MSW already started");
    return;
  }

  console.log("[MSW] Starting MSW server...");
  
  try {
    const { server } = await import("./src/mock/server");
    server.listen({ onUnhandledRequest: "bypass" });
    
    server.events.on("response:mocked", ({ request }) => {
      console.log("[MSW][MATCHED]", request.method, request.url);
    });
    server.events.on("response:bypass", ({ request }) => {
      console.log("[MSW][BYPASS]", request.method, request.url);
    });

    (globalThis as any).__MSW_NODE_STARTED__ = true;
    console.log("[MSW] MSW server started successfully");
  } catch (error) {
    console.error("[MSW] Failed to start MSW server:", error);
  }
}
