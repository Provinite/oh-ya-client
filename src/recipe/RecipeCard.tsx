import * as React from "react";
import { FunctionComponent, useState, useEffect } from "react";
import { api } from "../api/api";
import { InventoryItem } from "../api/InventoryItem";
import { Recipe } from "../api/Recipe";
import "./RecipeCard.scss";
export interface RecipeCardProps {
  recipe: Recipe;
  onCook: (recipe: Recipe) => void;
}
export const RecipeCard: FunctionComponent<RecipeCardProps> = ({
  recipe,
  onCook,
}: RecipeCardProps) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Record<string, InventoryItem>>({});
  useEffect(() => {
    (async () => {
      setLoading(true);
      const itemIdsToFetch = [
        recipe.output_item,
        ...recipe.inputs.map((i) => i.inventory_item),
      ];
      const results = await Promise.all(
        itemIdsToFetch.map((id) => api.inventoryItem.findOne(id))
      );
      const newItemMap: typeof items = {};
      results.forEach((i) => (newItemMap[i.id] = i));
      setItems(newItemMap);
      setLoading(false);
    })();
  }, [recipe.id]);

  if (loading) {
    return <div>"Loading. . ."</div>;
  } else {
    return (
      <div className="recipe-card">
        <span className="recipe-card--title">
          {items[recipe.output_item].name} ({recipe.quantity})
        </span>
        {recipe.inputs.map((i) => (
          <span className="recipe-card--input" key={i.id}>
            ({i.quantity}) {items[i.inventory_item].name}
          </span>
        ))}
        <button
          className="pure-button pure-button-primary recipe-card--cook-button"
          onClick={() => onCook(recipe)}
        >
          Cook Batch
        </button>
      </div>
    );
  }
};
