"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import DashboardLayout from '@/components/layout/dashboard-layout';
import { AssetModal } from "@/app/components/AssetModal";
import { AssetViewModal } from "@/app/components/AssetViewModal";
import { AssetStatusBadge } from "@/components/ui/asset-status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Asset, AssetStatus } from '@/types/asset';

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
    cell: (row) => {
      const status = row.getValue("status") as AssetStatus;
      return <AssetStatusBadge status={status} />;
    }
  },
];

export default function AssetsPage() {
  const [showForm, setShowForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(undefined);
  const router = useRouter();
  const { data: session, status } = useSession();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'ALL'>('ALL');

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

  const filteredAssets = assets.filter(asset => {
    if (statusFilter === 'ALL') {
      return true;
    }
    return asset.status === statusFilter;
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-900">Assets</h1>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as AssetStatus | 'ALL')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="DISPOSED">Disposed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Add Asset
        </Button>
      </div>
      {showForm && <AssetModal 
        onClose={() => {
          setShowForm(false);
          setSelectedAsset(undefined);
        }} 
        asset={selectedAsset}
        onSuccess={(updatedAsset) => {
          if (selectedAsset) {
            // Update existing asset
            setAssets(assets.map(a => a.id === updatedAsset.id ? updatedAsset : a));
          } else {
            // Add new asset
            setAssets([updatedAsset, ...assets]);
          }
        }}
      />}
      {showViewModal && selectedAsset && (
        <AssetViewModal
          asset={selectedAsset}
          onClose={() => {
            setShowViewModal(false);
            setSelectedAsset(undefined);
          }}
        />
      )}
      <DataTable 
        data={assets} 
        columns={columns}
        onView={(asset) => {
          setSelectedAsset(asset);
          setShowViewModal(true);
        }}
        onEdit={(asset) => {
          setSelectedAsset(asset);
          setShowForm(true);
        }}
        onDelete={async (asset) => {
          if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
              const response = await fetch(`/api/assets/${asset.id}`, {
                method: 'DELETE',
                credentials: 'include',
              });

              if (!response.ok) {
                throw new Error('Failed to delete asset');
              }

              setAssets(assets.filter(a => a.id !== asset.id));
              toast.success('Asset deleted successfully');
            } catch (error) {
              console.error('Error deleting asset:', error);
              toast.error('Failed to delete asset');
            }
          }
        }}
      />
    </DashboardLayout>
  );
} 