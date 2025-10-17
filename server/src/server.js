// server/src/server.js
require("dotenv").config();
const { testConnection } = require("./db");
const app = require("./app");
const http = require("http");

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "127.0.0.1";

const REQUIRED_ENV = ["JWT_SECRET", "DB_HOST", "DB_NAME", "DB_USER", "DB_PASS"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
}

const server = http.createServer(app);

const startServer = async () => {
  try {
    await testConnection();

    server.listen(PORT, HOST, () => {
      console.log(
        `🚀 API running in ${process.env.NODE_ENV || "development"} mode`
      );
      console.log(`📡 Listening on http://${HOST}:${PORT}`);
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      console.log(`\n🧩 Received ${signal}, shutting down...`);
      server.close(() => {
        console.log("🛑 HTTP server closed.");
        process.exit(0);
      });
    };
    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("💥 Server startup error:", error.message);
    process.exit(1);
  }
};

startServer();
