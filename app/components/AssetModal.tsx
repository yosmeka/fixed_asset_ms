"use client";

import { X } from "lucide-react";
import { AssetForm } from "@/app/assets/form";

export function AssetModal({ onClose }: { onClose: () => void }) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 mx-auto">
        <div className="p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-semibold text-blue-700 mb-4">Add New Asset</h2>

        <AssetForm onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
