import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { AuthenticatedUser } from "../types/index.js";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "shongjogbd_jwt_secret_dev_key_2026";

/**
 * JWT Authentication Middleware
 * Validates Bearer authorization header and attaches authenticated user payload to request.
 */
export function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access: No Bearer token provided",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
    if (!decoded || !decoded.email) {
      res.status(403).json({
        success: false,
        message: "Forbidden access: Malformed token payload",
      });
      return;
    }

    req.user = {
      email: decoded.email,
      name: decoded.name || "",
      image: decoded.image,
      id: decoded.id,
    };

    next();
  } catch (error) {
    res.status(403).json({
      success: false,
      message: "Forbidden access: Invalid or expired token",
    });
  }
}
