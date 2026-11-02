import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "shongjogbd_jwt_secret_dev_key_2026";

const jwtIssueSchema = z.object({
  email: z.string().email("A valid email address is required"),
  name: z.string().min(1, "Name is required"),
  image: z.string().optional(),
});

export async function issueJWT(req: Request, res: Response): Promise<void> {
  try {
    const parseResult = jwtIssueSchema.safeParse(req.body);

    if (!parseResult.success) {
      res.status(400).json({
        success: false,
        message: "Invalid token request payload",
        errors: parseResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { email, name, image } = parseResult.data;

    const token = jwt.sign(
      {
        email,
        name,
        image,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: { email, name, image },
    });
  } catch (error) {
    console.error("[Auth] Error issuing JWT token:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error issuing authentication token",
    });
  }
}
