import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";
import { Role } from "@prisma/client";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = userSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ error: "User already exists" }),
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    // Create user with explicit role
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: Role.USER,
      },
    });

    return NextResponse.json({
      user: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(
        JSON.stringify({ error: error.errors }),
        { status: 400 }
      );
    }
    return new NextResponse(
      JSON.stringify({ error: "Failed to create user. Please try again." }),
      { status: 500 }
    );
  }
} 