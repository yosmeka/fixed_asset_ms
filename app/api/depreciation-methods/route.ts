import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { name, description, formula, isActive } = body;

    if (!name || !formula) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const depreciationMethod = await prisma.depreciationMethod.create({
      data: {
        name,
        description,
        formula,
        isActive,
        userId: session.user.id,
      },
    });

    return NextResponse.json(depreciationMethod);
  } catch (error) {
    console.error('Error creating depreciation method:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const depreciationMethods = await prisma.depreciationMethod.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(depreciationMethods);
  } catch (error) {
    console.error('Error fetching depreciation methods:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
} 