import { Router } from "express";
import {
  createEvent,
  getRecentEvents,
  getUpcomingEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent,
  seedCommunityEvents,
} from "../controllers/events.controller.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const router = Router();

// Public: Seed initial realistic Bangladesh events (if empty)
router.post("/seed", seedCommunityEvents);
router.get("/seed", seedCommunityEvents);

// Public: 6 most imminent upcoming events for landing page
router.get("/events/recent", getRecentEvents);

// Public: All upcoming events with search and category filtering
router.get("/events/upcoming", getUpcomingEvents);

// Public: Single event details by ID
router.get("/events/:id", getEventById);

// Protected: Create a new community event
router.post("/events", verifyJWT, createEvent);

// Protected: Get all events created by the logged-in user
router.get("/my-events", verifyJWT, getMyEvents);

// Protected: Update an event (Owner only)
router.put("/events/:id", verifyJWT, updateEvent);

// Protected: Delete an event (Owner only, cascade deletes joins)
router.delete("/events/:id", verifyJWT, deleteEvent);

export default router;
