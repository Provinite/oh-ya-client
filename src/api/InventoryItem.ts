export interface InventoryItem {
  id: number;
  name: string;
  cost_cents: number;
  price_cents: number;
  for_sale: boolean;
  can_purchase: boolean;
  stock: number;
}
