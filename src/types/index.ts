import { ObjectId } from "mongodb";

export type EventCategory =
  | "Cleanup"
  | "Plantation"
  | "Donation"
  | "Winter Clothes"
  | "Food Drive"
  | "Medical Camp";

export interface IEvent {
  _id?: ObjectId;
  title: string;
  description: string;
  eventType: EventCategory | string;
  thumbnailUrl: string;
  location: string;
  eventDate: Date;
  creatorEmail: string;
  creatorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJoinedEvent {
  _id?: ObjectId;
  eventId: ObjectId | string;
  userEmail: string;
  userName: string;
  joinedAt: Date;
  eventDetails: {
    title: string;
    description: string;
    eventType: string;
    thumbnailUrl: string;
    location: string;
    eventDate: Date;
    creatorName: string;
  };
}

export interface AuthenticatedUser {
  email: string;
  name: string;
  image?: string;
  id?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
