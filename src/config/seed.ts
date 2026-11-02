import { Collection } from "mongodb";
import { IEvent } from "../types";

export function getInitialSeedEvents(): Omit<IEvent, "_id">[] {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;

  return [
    {
      title: "Winter Clothes Distribution – Mirpur 10, Dhaka",
      description:
        "Join our youth volunteer force to distribute high-grade warm jackets, sweaters, and thermals to underprivileged families, street children, and elderly residents living around Mirpur 10 Roundabout.",
      eventType: "Winter Clothes",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
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
      thumbnailUrl:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb0?auto=format&fit=crop&w=1200&q=80",
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
      thumbnailUrl:
        "https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&w=1200&q=80",
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
      thumbnailUrl:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
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
      thumbnailUrl:
        "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=1200&q=80",
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
      thumbnailUrl:
        "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
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
      thumbnailUrl:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
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
      thumbnailUrl:
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
      location: "Farmgate Foot Overbridge Plaza, Dhaka",
      eventDate: new Date(now + 30 * day), // 30 days in future
      creatorEmail: "nightaid@shongjogbd.org",
      creatorName: "Kazi Ahsan Habib",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

export async function checkAndSeedEvents(
  collection: Collection<IEvent>
): Promise<number> {
  const count = await collection.countDocuments();
  if (count === 0) {
    const seedData = getInitialSeedEvents();
    const result = await collection.insertMany(seedData as any);
    console.log(
      `[Seed] Initialized database with ${result.insertedCount} realistic Bangladesh community events.`
    );
    return result.insertedCount;
  }
  return 0;
}
