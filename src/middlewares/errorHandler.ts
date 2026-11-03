/**
 * Global Error and Route Fallback Handlers
 * Provides uniform JSON error formatting across all express routes.
 */
import { Request, Response, NextFunction } from "express";

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: `Resource not found at route: ${req.method} ${req.originalUrl}`,
  });
}

export function globalErrorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[ServerError]", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred",
  });
}
