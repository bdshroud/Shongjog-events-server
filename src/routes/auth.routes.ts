import { Router } from "express";
import { issueJWT } from "../controllers/auth.controller";

const router = Router();

// Endpoint for frontend session to exchange user info for signed JWT
router.post("/jwt", issueJWT);

export default router;
