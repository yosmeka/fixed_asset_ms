import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
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

    const asset = await prisma.asset.create({
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
        status: "ACTIVE",
        depreciationMethod: "STRAIGHT_LINE",
        userId: token.sub,
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("[ASSETS_POST]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const assets = await prisma.asset.findMany({
      where: {
        userId: token.sub,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("[ASSETS_GET]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const assetId = req.nextUrl.searchParams.get('id');

    if (!assetId) {
      return NextResponse.json(
        { error: "Asset ID is required" },
        { status: 400 }
      );
    }

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
        id: assetId,
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
    console.error("[ASSETS_PUT]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}