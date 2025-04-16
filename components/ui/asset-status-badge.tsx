import { cn } from "@/lib/utils";

type AssetStatus = "ACTIVE" | "INACTIVE" | "DISPOSED";

interface AssetStatusBadgeProps {
  status: AssetStatus;
  className?: string;
}

const statusStyles = {
  ACTIVE: "bg-green-100 text-green-800 border-green-200",
  INACTIVE: "bg-yellow-100 text-yellow-800 border-yellow-200",
  DISPOSED: "bg-red-100 text-red-800 border-red-200",
};

export function AssetStatusBadge({ status, className }: AssetStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        statusStyles[status],
        className
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}
