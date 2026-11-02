import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/events.routes.js";
import participantRoutes from "./routes/participants.routes.js";
import {
  notFoundHandler,
  globalErrorHandler,
} from "./middlewares/errorHandler.js";

dotenv.config();

export const app: Application = express();

const clientUrl = (
  process.env.CLIENT_URL || "https://shongjog-events-client.vercel.app"
).replace(/\/+$/, "");

// Normalize allowed origins and support local ports and any Vercel deployment
const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  const clean = origin.replace(/\/+$/, "");
  return (
    clean === clientUrl ||
    clean === "http://localhost:3000" ||
    clean === "http://127.0.0.1:3000" ||
    clean === "http://localhost:3001" ||
    clean.endsWith(".vercel.app")
  );
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isOriginAllowed(origin)) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
    exposedHeaders: ["Set-Cookie"],
  })
);

// Fix Vercel serverless rewrites where req.url is altered to /api/index
app.use((req, _res, next) => {
  if (req.url === "/api/index" && req.originalUrl) {
    req.url = req.originalUrl;
  }
  next();
});

// CRITICAL: Mount BetterAuth handler BEFORE express.json() so raw body streams are preserved
app.all(["/api/auth", "/api/auth/*"], toNodeHandler(auth));

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
