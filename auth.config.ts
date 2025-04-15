import type { NextAuthOptions } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/assets")) {
        return url;
      }
      return baseUrl;
    },
  },
  providers: [],
} satisfies NextAuthOptions; 