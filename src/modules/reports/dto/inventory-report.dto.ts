export class InventoryReportItemDto {
  productId: number;
  productName: string;
  categoryName: string | null;
  quantity: number;
  reserved: number;
  available: number;
  minStock: number;
  belowMin: boolean;
}


