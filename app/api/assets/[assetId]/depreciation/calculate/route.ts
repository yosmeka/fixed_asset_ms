import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { calculateDepreciation } from "@/lib/depreciation";

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
    const { year, unitsProduced, totalEstimatedUnits } = body;

    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    });

    if (!asset) {
      return NextResponse.json(
        { error: "Asset not found" },
        { status: 404 }
      );
    }

    const depreciation = calculateDepreciation(
      Number(asset.cost),
      Number(asset.salvageValue),
      asset.usefulLife,
      asset.depreciationMethod,
      year,
      unitsProduced,
      totalEstimatedUnits
    );

    // Save the depreciation record
    const record = await prisma.depreciationRecord.create({
      data: {
        assetId,
        year,
        amount: depreciation.yearlyDepreciation,
        accumulatedDepreciation: depreciation.accumulatedDepreciation,
        bookValue: depreciation.bookValue
      }
    });

    return NextResponse.json(record);
  } catch (error) {
    console.error("Error calculating depreciation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
