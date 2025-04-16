import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: { assetId: string } }) {
  try {
    const token = await getToken({ req: req as any });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      description,
      type,
      cost,
      purchaseDate,
      location,
      condition,
      usefulLife,
      salvageValue,
    } = body;

    // Validate required fields
    if (!name || !type || !cost || !purchaseDate || !location || !condition || !usefulLife || !salvageValue) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const asset = await prisma.asset.update({
      where: {
        id: params.assetId,
        userId: token.sub,
      },
      data: {
        name,
        description,
        type,
        cost: parseFloat(cost),
        purchaseDate: new Date(purchaseDate),
        location,
        condition,
        usefulLife: parseInt(usefulLife),
        salvageValue: parseFloat(salvageValue),
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("[ASSET_PUT]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { assetId: string } }) {
  try {
    const token = await getToken({ req: req as any });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const asset = await prisma.asset.findUnique({
      where: {
        id: params.assetId,
        userId: token.sub,
      },
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("[ASSET_GET]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { assetId: string } }) {
  try {
    const token = await getToken({ req: req as any });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.asset.delete({
      where: {
        id: params.assetId,
        userId: token.sub,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ASSET_DELETE]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}