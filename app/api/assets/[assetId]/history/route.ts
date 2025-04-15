import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(
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
    
    // Get asset history including depreciation records and disposal info
    const assetHistory = await prisma.asset.findUnique({
      where: { id: assetId },
      include: {
        depreciationRecords: {
          orderBy: { year: 'asc' }
        },
        disposals: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!assetHistory) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(assetHistory);
  } catch (error) {
    console.error("Error fetching asset history:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
