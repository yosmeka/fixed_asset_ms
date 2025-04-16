import { X } from "lucide-react";
import { format } from "date-fns";

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
  usefulLife: number;
  salvageValue: number;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetViewModalProps {
  asset: Asset;
  onClose: () => void;
}

export function AssetViewModal({ asset, onClose }: AssetViewModalProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), 'PPP');
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-blue-700">Asset Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-500">Name</h3>
              <p className="text-gray-900">{asset.name}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Type</h3>
              <p className="text-gray-900">{asset.type}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Description</h3>
              <p className="text-gray-900">{asset.description}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Location</h3>
              <p className="text-gray-900">{asset.location}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Cost</h3>
              <p className="text-gray-900">{formatCurrency(asset.cost)}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Purchase Date</h3>
              <p className="text-gray-900">{formatDate(asset.purchaseDate)}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Condition</h3>
              <p className="text-gray-900">{asset.condition}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Status</h3>
              <p className="text-gray-900">{asset.status}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Useful Life (years)</h3>
              <p className="text-gray-900">{asset.usefulLife}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Salvage Value</h3>
              <p className="text-gray-900">{formatCurrency(asset.salvageValue)}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Created At</h3>
              <p className="text-gray-900">{formatDate(asset.createdAt)}</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-500">Last Updated</h3>
              <p className="text-gray-900">{formatDate(asset.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
