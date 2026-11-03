/**
 * Event Controller
 * Orchestrates CRUD operations, pagination, search, category filters,
 * and participant count aggregations for all community initiatives.
 */
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { eventsCollection, joinedEventsCollection, db } from "../config/db.js";
import { eventSchema } from "../validators/event.validator.js";
import { IEvent, IJoinedEvent } from "../types/index.js";
import { getInitialSeedEvents, cleanupAndDeduplicateEvents } from "../config/seed.js";

// Seed or reset community events
export async function seedCommunityEvents(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const col = eventsCollection || db.collection<IEvent>("events");
    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");
    const count = await col.countDocuments();
    let inserted = 0;
    if (count === 0) {
      const seeds = getInitialSeedEvents();
      const result = await col.insertMany(seeds as any);
      inserted = result.insertedCount;
    }

    const cleanupStats = await cleanupAndDeduplicateEvents(col, jCol);
    const finalCount = await col.countDocuments();

    res.status(200).json({
      success: true,
      message: `Database synchronized. Seeded: ${inserted}, deduplicated: ${cleanupStats.deletedDuplicates}, URLs updated: ${cleanupStats.updatedEvents + cleanupStats.updatedJoined}.`,
      count: finalCount,
    });
    return;
  } catch (error) {
    console.error("[Seed] Error seeding events:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error seeding community events",
    });
  }
}

// Public: Get 6 most imminent upcoming events for Home page
export async function getRecentEvents(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const col = eventsCollection || db.collection<IEvent>("events");
    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");

    // Strictly filter out past events and limit to 6
    const now = new Date();
    const rawEvents = await col
      .find({ eventDate: { $gte: now } })
      .sort({ eventDate: 1 })
      .limit(6)
      .toArray();

    // Attach participant counts
    const eventsWithCounts = await Promise.all(
      rawEvents.map(async (event: any) => {
        const count = await jCol.countDocuments({
          $or: [
            { eventId: event._id! },
            { eventId: event._id!.toString() },
          ],
        });
        return {
          ...event,
          participantCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: eventsWithCounts.length,
      events: eventsWithCounts,
    });
  } catch (error) {
    console.error("[Events] Error fetching recent events:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error fetching recent community events",
    });
  }
}

// Public: Get all upcoming events with optional search and category filter
export async function getUpcomingEvents(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const col = eventsCollection || db.collection<IEvent>("events");
    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");

    const { search, eventType } = req.query;

    const filter: Record<string, any> = {
      eventDate: { $gte: new Date() },
    };

    if (search && typeof search === "string" && search.trim() !== "") {
      const sanitized = search.trim();
      filter.$or = [
        { title: { $regex: sanitized, $options: "i" } },
        { location: { $regex: sanitized, $options: "i" } },
        { description: { $regex: sanitized, $options: "i" } },
      ];
    }

    if (
      eventType &&
      typeof eventType === "string" &&
      eventType !== "All" &&
      eventType.trim() !== ""
    ) {
      filter.eventType = eventType.trim();
    }

    const rawEvents = await col
      .find(filter)
      .sort({ eventDate: 1 })
      .toArray();

    const eventsWithCounts = await Promise.all(
      rawEvents.map(async (event: any) => {
        const count = await jCol.countDocuments({
          $or: [
            { eventId: event._id! },
            { eventId: event._id!.toString() },
          ],
        });
        return {
          ...event,
          participantCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: eventsWithCounts.length,
      events: eventsWithCounts,
    });
  } catch (error) {
    console.error("[Events] Error fetching upcoming events:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error fetching upcoming community events",
    });
  }
}

// Public: Get single event by ID with live participant count
export async function getEventById(req: Request, res: Response): Promise<void> {
  try {
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

    const participantCount = await jCol.countDocuments({
      $or: [{ eventId: new ObjectId(id) }, { eventId: id }],
    });

    res.status(200).json({
      success: true,
      event: {
        ...event,
        participantCount,
      },
    });
  } catch (error) {
    console.error("[Events] Error fetching event details:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error fetching event details",
    });
  }
}

// Protected: Create a new community event
export async function createEvent(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user.email) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User credentials missing",
      });
      return;
    }

    const validationResult = eventSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed for event creation",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, description, eventType, thumbnailUrl, location, eventDate } =
      validationResult.data;

    const collection = eventsCollection || db.collection<IEvent>("events");

    const newEvent: IEvent = {
      title,
      description,
      eventType,
      thumbnailUrl,
      location,
      eventDate, // BSON Date object strictly in the future
      creatorEmail: req.user.email,
      creatorName: req.user.name || req.user.email.split("@")[0],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const insertResult = await collection.insertOne(newEvent as any);

    res.status(201).json({
      success: true,
      message: "Community event created successfully",
      eventId: insertResult.insertedId,
      event: { ...newEvent, _id: insertResult.insertedId },
    });
  } catch (error) {
    console.error("[Events] Error creating event:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error creating event",
    });
  }
}

// Protected: Get events created by currently authenticated user
export async function getMyEvents(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user || !req.user.email) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User credentials missing",
      });
      return;
    }

    const col = eventsCollection || db.collection<IEvent>("events");
    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");

    const events = await col
      .find({ creatorEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    const eventsWithCounts = await Promise.all(
      events.map(async (event: any) => {
        const count = await jCol.countDocuments({
          $or: [
            { eventId: event._id! },
            { eventId: event._id!.toString() },
          ],
        });
        return {
          ...event,
          participantCount: count,
        };
      })
    );

    res.status(200).json({
      success: true,
      count: eventsWithCounts.length,
      events: eventsWithCounts,
    });
  } catch (error) {
    console.error("[Events] Error fetching user created events:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error fetching your created events",
    });
  }
}

// Protected: Update an event owned by the user with future date validation
export async function updateEvent(req: Request, res: Response): Promise<void> {
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
    const existingEvent = await col.findOne({ _id: new ObjectId(id) });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    // Owner check: strictly only creator can update
    if (existingEvent.creatorEmail !== req.user.email) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to update this event",
      });
      return;
    }

    const validationResult = eventSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed for event update",
        errors: validationResult.error.flatten().fieldErrors,
      });
      return;
    }

    const { title, description, eventType, thumbnailUrl, location, eventDate } =
      validationResult.data;

    const updatedFields = {
      title,
      description,
      eventType,
      thumbnailUrl,
      location,
      eventDate, // Validated future Date
      updatedAt: new Date(),
    };

    await col.updateOne({ _id: new ObjectId(id) }, { $set: updatedFields });

    // Also update any snapshot in joinedEventsCollection for data consistency
    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");
    await jCol.updateMany(
      { $or: [{ eventId: new ObjectId(id) }, { eventId: id }] },
      {
        $set: {
          "eventDetails.title": title,
          "eventDetails.description": description,
          "eventDetails.eventType": eventType,
          "eventDetails.thumbnailUrl": thumbnailUrl,
          "eventDetails.location": location,
          "eventDetails.eventDate": eventDate,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Community event updated successfully",
      event: { ...existingEvent, ...updatedFields },
    });
  } catch (error) {
    console.error("[Events] Error updating event:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error updating event",
    });
  }
}

// Protected: Delete an event owned by the user (with cascade delete for participants)
export async function deleteEvent(req: Request, res: Response): Promise<void> {
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
    const existingEvent = await col.findOne({ _id: new ObjectId(id) });

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: "Event not found",
      });
      return;
    }

    // Owner check: strictly only creator can delete
    if (existingEvent.creatorEmail !== req.user.email) {
      res.status(403).json({
        success: false,
        message: "Forbidden: You are not authorized to delete this event",
      });
      return;
    }

    // Delete event
    await col.deleteOne({ _id: new ObjectId(id) });

    // Cascade delete matching records from joinedEventsCollection
    const jCol =
      joinedEventsCollection || db.collection<IJoinedEvent>("joined_events");
    const deleteJoinResult = await jCol.deleteMany({
      $or: [{ eventId: new ObjectId(id) }, { eventId: id }],
    });

    res.status(200).json({
      success: true,
      message:
        "Community event and associated participant records deleted successfully",
      cascadeDeletedJoins: deleteJoinResult.deletedCount,
    });
  } catch (error) {
    console.error("[Events] Error deleting event:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error deleting event",
    });
  }
}
