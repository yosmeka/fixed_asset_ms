export interface Asset {
  id: string;
  name: string;
  type: string;
  cost: number;
  purchaseDate: Date;
  location: string;
  condition: string;
  status: string;
  depreciationMethod: string;
  usefulLife: number;
  salvageValue: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
} 