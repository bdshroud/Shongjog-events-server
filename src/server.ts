import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
  } catch (err) {
    console.warn("[Warning] MongoDB not connected yet. Server starting anyway...");
  }

  app.listen(PORT, () => {
    console.log(`[Server] ShongjogBD API running on http://localhost:${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}
