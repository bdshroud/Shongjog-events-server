import { Collection, ObjectId } from "mongodb";
import { IEvent, IJoinedEvent } from "../types/index.js";

export const VERIFIED_EVENT_IMAGES: Record<string, string> = {
  "Winter Clothes":
    "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1000&q=80",
  Donation:
    "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1000&q=80",
  Plantation:
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1000&q=80",
  Cleanup:
    "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1000&q=80",
  "Food Drive":
    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1000&q=80",
  "Medical Camp":
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
};

export function getInitialSeedEvents(): Omit<IEvent, "_id">[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      title: "Winter Clothes Distribution – Mirpur 10, Dhaka",
      description:
        "Join our youth volunteer force to distribute high-grade warm jackets, sweaters, and thermals to underprivileged families, street children, and elderly residents living around Mirpur 10 Roundabout.",
      eventType: "Winter Clothes",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Winter Clothes"],
      location: "Mirpur 10 Circle, Dhaka",
      eventDate: new Date(now + 4 * day), // 4 days in future
      creatorEmail: "organizer.dhaka@shongjogbd.org",
      creatorName: "Shongjog Dhaka Volunteer Wing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Blanket Distribution for the Needy – Mohammadpur, Dhaka",
      description:
        "Severe winter cold hits homeless families the hardest. We are collecting and distributing thick winter blankets, wool socks, and hot nutritious meals at Mohammadpur Geneva Camp and Town Hall area.",
      eventType: "Winter Clothes",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Winter Clothes"],
      location: "Town Hall Market, Mohammadpur, Dhaka",
      eventDate: new Date(now + 7 * day), // 7 days in future
      creatorEmail: "mohammadpur.aid@shongjogbd.org",
      creatorName: "Tanzimul Islam",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Coastal Plastic Cleanup – Patenga Beach, Chattogram",
      description:
        "Preserve our coastal ecosystem! Volunteers will gather at Patenga Sea Beach with biodegradable bags and protective gear to remove single-use plastics, nylon nets, and debris along the shoreline.",
      eventType: "Cleanup",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Cleanup"],
      location: "Patenga Sea Beach, Chattogram",
      eventDate: new Date(now + 11 * day), // 11 days in future
      creatorEmail: "chattogram.green@shongjogbd.org",
      creatorName: "Chattogram Green Guardians",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Urban Tree Plantation – Dhanmondi Lake, Dhaka",
      description:
        "Bring oxygen back to Dhaka! We are planting 500 indigenous fruit-bearing and shade trees (Bakul, Jarul, Krishnachura, and Neem) along Dhanmondi Lake walkways. Free saplings provided to all participants.",
      eventType: "Plantation",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Plantation"],
      location: "Rabindra Sarobar, Dhanmondi Lake, Dhaka",
      eventDate: new Date(now + 14 * day), // 14 days in future
      creatorEmail: "eco.dhaka@shongjogbd.org",
      creatorName: "Nusrat Jahan",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Clean Buriganga Riverfront Campaign – Sadarghat, Dhaka",
      description:
        "A historic public movement to rescue the lifeline of Old Dhaka. Volunteers and environmental activists will work together to remove floating polythene and spread civic awareness against river dumping.",
      eventType: "Cleanup",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Cleanup"],
      location: "Sadarghat Launch Terminal Area, Dhaka",
      eventDate: new Date(now + 18 * day), // 18 days in future
      creatorEmail: "buriganga.rescue@shongjogbd.org",
      creatorName: "Old Dhaka Civic Forum",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Free Community Medical & Diabetes Camp – Halishahar, Chattogram",
      description:
        "Volunteer doctors and nurses will provide free clinical consultations, blood glucose screening, blood pressure checks, and essential OTC medicines for low-income workers and elderly residents.",
      eventType: "Medical Camp",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Medical Camp"],
      location: "Halishahar Housing Estate Community Center, Chattogram",
      eventDate: new Date(now + 22 * day), // 22 days in future
      creatorEmail: "health.ctg@shongjogbd.org",
      creatorName: "Dr. Farhan Akhtar",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Nutrition Ration Pack Distribution – Agrabad, Chattogram",
      description:
        "Distributing emergency food packages containing rice, lentils, fortified oil, salt, and baby nutrition supplies to 400 vulnerable families facing inflation hardships in Agrabad commercial vicinity.",
      eventType: "Food Drive",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Food Drive"],
      location: "Agrabad Access Road Community Grounds, Chattogram",
      eventDate: new Date(now + 26 * day), // 26 days in future
      creatorEmail: "relief.ctg@shongjogbd.org",
      creatorName: "Chattogram Relief Network",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Warm Khichuri & Tea for Rickshaw Pullers – Farmgate, Dhaka",
      description:
        "Late-night hot khichuri, boiled eggs, and tea distribution for day-laborers, transport workers, and night-shift rickshaw pullers braving chilly Dhaka winter nights at Farmgate intersection.",
      eventType: "Donation",
      thumbnailUrl: VERIFIED_EVENT_IMAGES["Donation"],
      location: "Farmgate Foot Overbridge Plaza, Dhaka",
      eventDate: new Date(now + 30 * day), // 30 days in future
      creatorEmail: "nightaid@shongjogbd.org",
      creatorName: "Kazi Ahsan Habib",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

/**
 * Startup cleanup routine:
 * a) Deduplicates events in eventsCollection having the same title
 *    (keeps only one document per unique title).
 * b) Updates all existing documents in eventsCollection and joinedEventsCollection
 *    to replace any broken Unsplash URLs with verified working URLs based on eventType.
 */
export async function cleanupAndDeduplicateEvents(
  eventsCol: Collection<IEvent>,
  joinedCol?: Collection<IJoinedEvent>
): Promise<{ deletedDuplicates: number; updatedEvents: number; updatedJoined: number }> {
  let deletedDuplicates = 0;
  let updatedEvents = 0;
  let updatedJoined = 0;

  // --- a) Deduplicate events in eventsCollection having the same title ---
  const allEvents = await eventsCol.find({}).sort({ _id: 1 }).toArray();
  const seenTitles = new Map<string, (typeof allEvents)[0]>();
  const duplicateIds: ObjectId[] = [];
  const idReplacementMap = new Map<string, string>();

  for (const ev of allEvents) {
    const titleKey = ev.title?.trim().toLowerCase();
    if (!titleKey) continue;

    if (seenTitles.has(titleKey)) {
      const kept = seenTitles.get(titleKey)!;
      if (ev._id) {
        duplicateIds.push(ev._id);
        if (kept._id) {
          idReplacementMap.set(ev._id.toString(), kept._id.toString());
        }
      }
    } else {
      seenTitles.set(titleKey, ev);
    }
  }

  if (duplicateIds.length > 0) {
    const deleteResult = await eventsCol.deleteMany({ _id: { $in: duplicateIds } });
    deletedDuplicates = deleteResult.deletedCount;
    console.log(
      `[Startup Cleanup] Deduplicated events: removed ${deletedDuplicates} duplicate event document(s).`
    );
  }

  // If joinedEventsCollection references deleted duplicate IDs, repoint to kept ID
  if (joinedCol && idReplacementMap.size > 0) {
    for (const [oldId, newId] of idReplacementMap.entries()) {
      try {
        await joinedCol.updateMany(
          { eventId: oldId },
          { $set: { eventId: newId } }
        );
      } catch (e) {
        // In case unique index ({ eventId: 1, userEmail: 1 }) is violated, clean redundant join
        await joinedCol.deleteMany({ eventId: oldId });
      }

      try {
        await joinedCol.updateMany(
          { eventId: new ObjectId(oldId) as any },
          { $set: { eventId: newId } }
        );
      } catch {}
    }
  }

  // --- b) Updates all existing documents in eventsCollection and joinedEventsCollection ---
  // Replace broken Unsplash URLs (e.g. photo-1532629345422-7515f3d16bb0) or empty/missing URLs
  // with verified working URLs based on eventType.
  const brokenUrlPattern = "photo-1532629345422-7515f3d16bb0";

  for (const [eventType, verifiedUrl] of Object.entries(VERIFIED_EVENT_IMAGES)) {
    // 1. Update eventsCollection for this category
    const eventResult = await eventsCol.updateMany(
      {
        eventType,
        $or: [
          { thumbnailUrl: { $regex: brokenUrlPattern } },
          { thumbnailUrl: "" },
          { thumbnailUrl: { $exists: false } },
        ],
      } as any,
      {
        $set: {
          thumbnailUrl: verifiedUrl,
          updatedAt: new Date(),
        },
      }
    );
    updatedEvents += eventResult.modifiedCount;

    // 2. Update joinedEventsCollection for this category
    if (joinedCol) {
      const joinedResult = await joinedCol.updateMany(
        {
          "eventDetails.eventType": eventType,
          $or: [
            { "eventDetails.thumbnailUrl": { $regex: brokenUrlPattern } },
            { "eventDetails.thumbnailUrl": "" },
            { "eventDetails.thumbnailUrl": { $exists: false } },
          ],
        } as any,
        {
          $set: {
            "eventDetails.thumbnailUrl": verifiedUrl,
          },
        }
      );
      updatedJoined += joinedResult.modifiedCount;
    }
  }

  // General fallback sweep for any remaining documents containing the broken Unsplash URL
  const remainingBrokenEvents = await eventsCol
    .find({ thumbnailUrl: { $regex: brokenUrlPattern } })
    .toArray();

  for (const ev of remainingBrokenEvents) {
    const verified =
      VERIFIED_EVENT_IMAGES[ev.eventType] ||
      VERIFIED_EVENT_IMAGES["Winter Clothes"];
    await eventsCol.updateOne(
      { _id: ev._id },
      { $set: { thumbnailUrl: verified, updatedAt: new Date() } }
    );
    updatedEvents++;
  }

  if (joinedCol) {
    const remainingBrokenJoined = await joinedCol
      .find({ "eventDetails.thumbnailUrl": { $regex: brokenUrlPattern } })
      .toArray();

    for (const j of remainingBrokenJoined) {
      const verified =
        VERIFIED_EVENT_IMAGES[j.eventDetails?.eventType] ||
        VERIFIED_EVENT_IMAGES["Winter Clothes"];
      await joinedCol.updateOne(
        { _id: j._id },
        { $set: { "eventDetails.thumbnailUrl": verified } }
      );
      updatedJoined++;
    }
  }

  if (updatedEvents > 0 || updatedJoined > 0) {
    console.log(
      `[Startup Cleanup] Replaced broken URLs in ${updatedEvents} event(s) and ${updatedJoined} joined event(s) with verified URLs.`
    );
  }

  return { deletedDuplicates, updatedEvents, updatedJoined };
}

export async function checkAndSeedEvents(
  collection: Collection<IEvent>,
  joinedCollection?: Collection<IJoinedEvent>
): Promise<number> {
  const count = await collection.countDocuments();
  let seededCount = 0;

  if (count === 0) {
    const seedData = getInitialSeedEvents();
    const result = await collection.insertMany(seedData as any);
    seededCount = result.insertedCount;
    console.log(
      `[Seed] Initialized database with ${seededCount} realistic Bangladesh community events.`
    );
  }

  // Do NOT skip if count > 0! Always perform startup cleanup and deduplication routine:
  await cleanupAndDeduplicateEvents(collection, joinedCollection);

  return seededCount;
}
