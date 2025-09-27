"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

let convexUrl

if (process.env.NEXT_PUBLIC_MODE === "WEBAPP") {
  convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
}
else {
  convexUrl = import.meta.env.VITE_CONVEX_URL;
}

if (!convexUrl) throw new Error("VITE_CONVEX_URL is required");

export const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}