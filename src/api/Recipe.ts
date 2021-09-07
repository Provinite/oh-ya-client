export interface Recipe {
  id: number;
  output_item: number;
  quantity: number;
  inputs: RecipeInput[];
}

export interface RecipeInput {
  id: number;
  inventory_item: number;
  quantity: number;
}
