"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/layout/dashboard-layout';
import { AssetModal } from "@/app/components/AssetModal";

interface Asset {
  id: string;
  name: string;
  description: string;
  type: string;
  cost: number;
  purchaseDate: Date;
  location: string;
  condition: string;
  status: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

type ColumnType = {
  accessorKey: keyof Asset;
  header: string;
  cell?: (row: { getValue: (key: keyof Asset) => any }) => React.ReactNode;
};

const columns: ColumnType[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: (row) => {
      const cost = row.getValue("cost") as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(cost);
    }
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "condition",
    header: "Condition",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

export default function AssetsPage() {
  const [showForm, setShowForm] = useState(false);
  const { data: session, status } = useSession();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }
  }, [status]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await fetch("/api/assets", {
          credentials: "include"
        });
        if (!response.ok) {
          throw new Error("Failed to fetch assets");
        }
        const data = await response.json();
        setAssets(data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchAssets();
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Fixed Assets</h1>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Add Asset
        </Button>
      </div>
      {showForm && <AssetModal onClose={() => setShowForm(false)} />}
      <DataTable data={assets} columns={columns} />
    </DashboardLayout>
  );
} 