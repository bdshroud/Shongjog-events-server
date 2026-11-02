import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { client } from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || "shongjogbd";
const clientUrl = (process.env.CLIENT_URL || "https://shongjog-events-client.vercel.app").replace(/\/+$/, "");

const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }
  return "https://shongjog-events-server.vercel.app";
};

const defaultOrigins = [
  "https://shongjog-events-client.vercel.app",
  "https://shongjogbd.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "https://*.vercel.app",
];

if (clientUrl && !defaultOrigins.includes(clientUrl)) {
  defaultOrigins.push(clientUrl);
}

export const auth = betterAuth({
  database: mongodbAdapter(client.db(dbName)),
  baseURL: getBaseUrl(),
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
  account: {
    skipStateCookieCheck: true,
  },
  advanced: {
    useSecureCookies: true,
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
    },
  },
  trustedOrigins: async (request) => {
    const origins = [...defaultOrigins];
    if (request) {
      const origin = request.headers.get("origin");
      if (origin) {
        const clean = origin.replace(/\/+$/, "");
        if (!origins.includes(clean)) {
          origins.push(clean);
        }
      }
      const referer = request.headers.get("referer");
      if (referer) {
        try {
          const refOrigin = new URL(referer).origin;
          if (!origins.includes(refOrigin)) {
            origins.push(refOrigin);
          }
        } catch {}
      }
    }
    return origins;
  },
});
