export type AssetStatus = 'ACTIVE' | 'INACTIVE' | 'DISPOSED';

export interface Asset {
  id: string;
  name: string;
  description: string;
  type: string;
  cost: number;
  purchaseDate: Date;
  location: string;
  condition: string;
  status: AssetStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  usefulLife: number;
  salvageValue: number;
  depreciationMethod?: string;
}
