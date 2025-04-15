import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { assetId: string } }
) {
  try {
    const token = await getToken({ req });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const assetId = params.assetId;
    const body = await req.json();
    const { disposalDate, disposalValue, reason } = body;

    // Validate required fields
    if (!disposalDate || !disposalValue || !reason) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create disposal record
    const disposal = await prisma.disposal.create({
      data: {
        assetId,
        userId: token.sub,
        disposalDate: new Date(disposalDate),
        disposalValue: parseFloat(disposalValue),
        reason,
        status: "PENDING"
      }
    });

    return NextResponse.json(disposal);
  } catch (error) {
    console.error("Error creating disposal record:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { assetId: string } }
) {
  try {
    const token = await getToken({ req });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const assetId = params.assetId;
    const body = await req.json();
    const { status } = body;

    // Update disposal status and asset status
    // First find the disposal record
    const existingDisposal = await prisma.disposal.findFirst({
      where: {
        assetId,
        status: "PENDING"
      }
    });

    if (!existingDisposal) {
      return NextResponse.json(
        { error: "No pending disposal request found for this asset" },
        { status: 404 }
      );
    }

    const [disposal, asset] = await prisma.$transaction([
      prisma.disposal.update({
        where: {
          id: existingDisposal.id
        },
        data: {
          status
        }
      }),
      prisma.asset.update({
        where: {
          id: assetId
        },
        data: {
          status: status === "APPROVED" ? "DISPOSED" : "ACTIVE"
        }
      })
    ]);

    return NextResponse.json({ disposal, asset });
  } catch (error) {
    console.error("Error updating disposal status:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
