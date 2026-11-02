import { Router } from "express";
import {
  joinEvent,
  getJoinedEvents,
  checkUserJoinStatus,
} from "../controllers/participants.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

// Protected: Join an event
router.post("/events/:id/join", verifyJWT, joinEvent);

// Protected: Check if logged-in user has already joined
router.get("/events/:id/join-status", verifyJWT, checkUserJoinStatus);

// Protected: Get all events joined by user (chronologically sorted)
router.get("/joined-events", verifyJWT, getJoinedEvents);

export default router;
