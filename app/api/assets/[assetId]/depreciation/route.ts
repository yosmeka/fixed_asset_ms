import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: { assetId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const asset = await prisma.asset.findUnique({
      where: {
        id: params.assetId,
        userId,
      },
      include: {
        depreciationRecords: true,
      },
    });

    if (!asset) {
      return new NextResponse("Not found", { status: 404 });
    }

    const currentYear = new Date().getFullYear();
    const purchaseYear = asset.purchaseDate.getFullYear();
    const yearsToCalculate = currentYear - purchaseYear + 1;

    // Clear existing depreciation records
    await prisma.depreciationRecord.deleteMany({
      where: {
        assetId: asset.id,
      },
    });

    // Calculate depreciation for each year
    const depreciationRecords = [];
    let accumulatedDepreciation = 0;

    for (let year = 0; year < yearsToCalculate; year++) {
      let depreciationAmount = 0;

      switch (asset.depreciationMethod) {
        case "STRAIGHT_LINE":
          depreciationAmount = (Number(asset.cost) - Number(asset.salvageValue)) / Number(asset.usefulLife);
          break;
        case "DECLINING_BALANCE":
          const rate = 2 / Number(asset.usefulLife); // Double declining balance
          const bookValue = Number(asset.cost) - accumulatedDepreciation;
          depreciationAmount = Math.max(
            bookValue * rate,
            (bookValue - Number(asset.salvageValue)) / (Number(asset.usefulLife) - year)
          );
          break;
        case "UNITS_OF_PRODUCTION":
          // This would require actual usage data
          depreciationAmount = 0;
          break;
      }

      accumulatedDepreciation += depreciationAmount;
      const bookValue = Number(asset.cost) - accumulatedDepreciation;

      const record = await prisma.depreciationRecord.create({
        data: {
          assetId: asset.id,
          year: purchaseYear + year,
          amount: depreciationAmount,
          accumulatedDepreciation,
          bookValue,
        },
      });

      depreciationRecords.push(record);
    }

    return NextResponse.json(depreciationRecords);
  } catch (error) {
    console.log("[DEPRECIATION_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { assetId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const depreciationRecords = await prisma.depreciationRecord.findMany({
      where: {
        asset: {
          id: params.assetId,
          userId,
        },
      },
      orderBy: {
        year: "asc",
      },
    });

    return NextResponse.json(depreciationRecords);
  } catch (error) {
    console.log("[DEPRECIATION_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
} 