// NextAuth App Router route handler.
// Mounts NextAuth at /api/auth/[...nextauth].

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
