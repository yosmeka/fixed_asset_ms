import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
    if (!token?.sub) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    switch (reportType) {
      case 'asset-value': {
        const assets = await prisma.asset.findMany({
          where: {
            createdAt: {
              gte: start,
              lte: end
            }
          },
          include: {
            depreciationRecords: {
              orderBy: { year: 'desc' },
              take: 1
            }
          }
        });

        const report = assets.map(asset => ({
          id: asset.id,
          name: asset.name,
          purchaseDate: asset.purchaseDate,
          originalCost: asset.cost,
          currentValue: asset.depreciationRecords[0]?.bookValue ?? asset.cost,
          status: asset.status
        }));

        return NextResponse.json(report);
      }

      case 'depreciation': {
        const depreciationRecords = await prisma.depreciationRecord.findMany({
          where: {
            createdAt: {
              gte: start,
              lte: end
            }
          },
          include: {
            asset: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        });

        return NextResponse.json(depreciationRecords);
      }

      case 'disposal': {
        const disposals = await prisma.disposal.findMany({
          where: {
            disposalDate: {
              gte: start,
              lte: end
            }
          },
          include: {
            asset: true
          },
          orderBy: {
            disposalDate: 'desc'
          }
        });

        return NextResponse.json(disposals);
      }

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error generating report:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
