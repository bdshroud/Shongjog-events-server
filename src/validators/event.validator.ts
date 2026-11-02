import { z } from "zod";

export const eventSchema = z.object({
  title: z
    .string({ required_error: "Event title is required" })
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string({ required_error: "Event description is required" })
    .trim()
    .min(15, "Description must be at least 15 characters long")
    .max(3000, "Description cannot exceed 3000 characters"),
  eventType: z
    .string({ required_error: "Event category is required" })
    .trim()
    .min(2, "Please select an event category"),
  thumbnailUrl: z
    .string({ required_error: "Thumbnail URL is required" })
    .trim()
    .url("A valid image URL is required"),
  location: z
    .string({ required_error: "Event location is required" })
    .trim()
    .min(3, "Location must be at least 3 characters (e.g., Mirpur 10, Dhaka)"),
  eventDate: z
    .union([z.string(), z.date()])
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: "A valid event date and time is required",
    })
    .transform((val) => new Date(val))
    .refine((date) => date.getTime() > Date.now(), {
      message: "Event date must be strictly in the future",
    }),
});

export type EventInput = z.infer<typeof eventSchema>;
