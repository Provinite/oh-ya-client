export interface SaleLine {
  id: number;
  inventory_item: number;
  price_cents: number;
  cost_cents: number;
  quantity: number;
}

export interface Sale {
  id: number;
  sale_lines: SaleLine[];
  created_at: string;
}
