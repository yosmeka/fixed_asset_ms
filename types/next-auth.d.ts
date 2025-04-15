import { Role } from "@prisma/client";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: Role;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
  }
} 