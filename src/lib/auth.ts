import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/modern-ai-shop";

const client = new MongoClient(MONGODB_URI);
const db = client.db(process.env.DB_NAME || "modernaishop_db");

export const auth = betterAuth({
  database: mongodbAdapter(db),
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-secret",
    }
  },
  plugins: [
    jwt()
  ]
});
export type Session = typeof auth.$Infer.Session;
