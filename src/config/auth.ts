import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || "shongjogbd";
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:5000",
  secret:
    process.env.BETTER_AUTH_SECRET ||
    "shongjogbd_super_secret_auth_encryption_key_2026_xyz",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    },
  },
  trustedOrigins: [
    clientUrl,
    "http://localhost:3000",
    "http://127.0.0.1:3000",
  ],
});
