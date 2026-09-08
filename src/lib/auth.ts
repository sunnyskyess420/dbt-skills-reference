// NextAuth configuration for DBT Skills Reference.
// Uses the Credentials provider (email + password) backed by Prisma/SQLite.
// Sessions are JWT-based (stateless), which works well on serverless / sandbox.

import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  // JWT strategy is the default for credentials provider and is what we want
  // so we never have to hit the DB on every session check.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 }, // 30 days
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" }, // only used on sign-up
        mode: { label: "Mode", type: "text" }, // "signin" | "signup"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }
        const email = credentials.email.trim().toLowerCase();
        const mode = credentials.mode || "signin";

        if (mode === "signup") {
          // Create a new account. If one already exists, refuse.
          const existing = await db.user.findUnique({ where: { email } });
          if (existing) {
            throw new Error("An account with that email already exists. Try signing in instead.");
          }
          if (credentials.password.length < 6) {
            throw new Error("Password must be at least 6 characters long.");
          }
          const passwordHash = await bcrypt.hash(credentials.password, 10);
          const user = await db.user.create({
            data: {
              email,
              name: credentials.name?.trim() || null,
              passwordHash,
            },
          });
          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
          };
        }

        // Sign-in path
        const user = await db.user.findUnique({ where: { email } });
        if (!user) {
          throw new Error("No account found with that email. Try creating one.");
        }
        const ok = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!ok) {
          throw new Error("Incorrect password. Please try again.");
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
        };
      },
    }),
  ],
  pages: {
    // We don't ship a dedicated sign-in page — the dialog handles it.
    // NextAuth still needs a value here for some flows; redirect to "/" so
    // any internal redirect lands back on the app.
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
