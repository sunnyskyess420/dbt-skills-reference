"use client";

// Thin wrapper around next-auth/react's SessionProvider so we can mount it
// from a client component in the layout tree.

import * as React from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
