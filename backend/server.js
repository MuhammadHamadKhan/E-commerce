const app = require("./src/app");
const { port } = require("./src/config");
const { connectDB } = require("./src/config/db");

async function startServer() {
  // Test DB connection first, then start listening
  await connectDB();

  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Graceful shutdown so connections are closed properly on restart/deploy.
  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down...`);
    server.close(() => {
      console.log("[server] closed");
      process.exit(0);
    });
  };

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => shutdown(signal));
  });

  module.exports = server;
}

startServer().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});
