import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { eventsCollection, joinedEventsCollection, db } from "../config/db.js";
import { IEvent, IJoinedEvent } from "../types/index.js";

// Protected: Join a community event
export async function joinEvent(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user.email) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User credentials missing",
      });
      return;
    }

    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
      return;
    }

    const col = eventsCollection || db.collection<IEvent>("events");
    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");

    const event = await col.findOne({ _id: new ObjectId(id) });
    if (!event) {
      res.status(404).json({
        success: false,
        message: "Community event not found",
      });
      return;
    }

    // Verify event is not in the past
    if (new Date(event.eventDate).getTime() < Date.now()) {
      res.status(400).json({
        success: false,
        message: "Cannot join an event that has already concluded",
      });
      return;
    }

    // Check if user already joined
    const existingJoin = await jCol.findOne({
      $or: [
        { eventId: new ObjectId(id), userEmail: req.user.email },
        { eventId: id, userEmail: req.user.email },
      ],
    });

    if (existingJoin) {
      res.status(409).json({
        success: false,
        message: "You have already joined this event",
      });
      return;
    }

    const joinRecord: IJoinedEvent = {
      eventId: new ObjectId(id),
      userEmail: req.user.email,
      userName: req.user.name || req.user.email.split("@")[0],
      joinedAt: new Date(),
      eventDetails: {
        title: event.title,
        description: event.description,
        eventType: event.eventType,
        thumbnailUrl: event.thumbnailUrl,
        location: event.location,
        eventDate: event.eventDate,
        creatorName: event.creatorName,
      },
    };

    try {
      const result = await jCol.insertOne(joinRecord as any);
      res.status(201).json({
        success: true,
        message: "Successfully joined this community event!",
        joinId: result.insertedId,
        joinedEvent: { ...joinRecord, _id: result.insertedId },
      });
    } catch (insertError: any) {
      // Catch MongoDB unique compound index collision (code 11000)
      if (insertError.code === 11000) {
        res.status(409).json({
          success: false,
          message: "You have already joined this event",
        });
        return;
      }
      throw insertError;
    }
  } catch (error) {
    console.error("[Participants] Error joining event:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while joining the event",
    });
  }
}

// Protected: Get all events joined by current user, sorted chronologically ascending by eventDate
export async function getJoinedEvents(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user || !req.user.email) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User credentials missing",
      });
      return;
    }

    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");

    // Chronologically sorted ascending by eventDate
    const joinedList = await jCol
      .find({ userEmail: req.user.email })
      .sort({ "eventDetails.eventDate": 1 })
      .toArray();

    res.status(200).json({
      success: true,
      count: joinedList.length,
      joinedEvents: joinedList,
    });
  } catch (error) {
    console.error("[Participants] Error fetching joined events:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error fetching your joined events",
    });
  }
}

// Protected: Check if current user has joined a specific event
export async function checkUserJoinStatus(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.user || !req.user.email) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User credentials missing",
      });
      return;
    }

    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid event ID format",
      });
      return;
    }

    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");

    const record = await jCol.findOne({
      $or: [
        { eventId: new ObjectId(id), userEmail: req.user.email },
        { eventId: id, userEmail: req.user.email },
      ],
    });

    res.status(200).json({
      success: true,
      hasJoined: !!record,
    });
  } catch (error) {
    console.error("[Participants] Error checking join status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error checking join status",
    });
  }
}
