import express from "express";
import cors from "cors";

const app = express();
const port = 9090;

// CORS 설정
app.use(cors());
app.use(express.json());

// 요청 로깅 미들웨어
app.use((req, res, next) => {
  console.log(`[Express] ${req.method} ${req.path}`);
  next();
});

// Mock API 라우트들
app.get("/api/hello", (req, res) => {
  res.json({ message: "hello from MSW Express Server!" });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    server: "Express Mock Server",
    port,
    timestamp: new Date().toISOString(),
  });
});

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`[Express] Mock server running on http://localhost:${port}`);
  console.log(`[Express] Health check: http://localhost:${port}/health`);
  console.log(`[Express] Mock API: http://localhost:${port}/api/hello`);
});
