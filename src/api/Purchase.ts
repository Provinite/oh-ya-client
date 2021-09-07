export interface PurchaseLine {
  id: number;
  inventory_item: number;
  quantity: number;
  cost_cents: number;
}

export interface Purchase {
  id: number;
  purchase_lines: PurchaseLine[];
}
