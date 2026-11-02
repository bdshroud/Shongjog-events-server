import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth";
import authRoutes from "./routes/auth.routes";
import eventRoutes from "./routes/events.routes";
import participantRoutes from "./routes/participants.routes";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/errorHandler";

dotenv.config();

export const app: Application = express();

const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: [clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);

// CRITICAL: Mount BetterAuth handler BEFORE express.json() so raw body streams are preserved
app.all("/api/auth/*", toNodeHandler(auth));

// Standard JSON parser for all subsequent custom REST routes
app.use(express.json());

// API Routes
app.use("/api", authRoutes);
app.use("/api", eventRoutes);
app.use("/api", participantRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    status: "OK",
    service: "ShongjogBD Server API",
    timestamp: new Date().toISOString(),
  });
});

// 404 & Global error handlers
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
