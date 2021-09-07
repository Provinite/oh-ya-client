import axios from "axios";
import * as React from "react";
import { useEffect, useState } from "react";
import { render } from "react-dom";
import { Recipe } from "./api/Recipe";
import "purecss";
import "./app.scss";
import { api } from "./api/api";
import { InventoryItem } from "./api/InventoryItem";
import { InventoryTableHeaderRow } from "./inventory/InventoryTableHeaderRow";
import { InventoryTableRow } from "./inventory/InventoryTableRow";
import { RecipeCard } from "./recipe/RecipeCard";
import { Sale } from "./api/Sale";
render(<App />, document.getElementById("app"));

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [lastInventoryActionTime, setLastInventoryActionTime] =
    useState<null | Date>(null);
  useEffect(() => {
    (async () => {
      setItems((await api.inventoryItem.findMany()).data);
    })();
  }, [lastInventoryActionTime]);
  useEffect(() => {
    (async () => {
      const recipes = await api.recipe.findMany();
      setRecipes(recipes.data);
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setSales((await api.sale.findMany()).data);
    })();
  }, []);

  return (
    <>
      <div className="header-section">
        <h1>Oh Yeah</h1>
        <button
          className="pure-button pure-button-secondary"
          onClick={() => api.seed()}
        >
          Get Started
        </button>
      </div>
      <div className="inventory-section">
        <h2>Inventory</h2>
        <table className="pure-table pure-table-bordered">
          <thead>
            <InventoryTableHeaderRow />
          </thead>
          <tbody>
            {items.map((i) => (
              <InventoryTableRow
                key={i.id}
                editable={false}
                inventoryItem={i}
                onChange={() => void 0}
                onSave={() => void 0}
                onPurchase={async () => {
                  await api.purchase.create({
                    purchase_lines: [{ inventory_item: i.id, quantity: 1 }],
                  });
                  setLastInventoryActionTime(new Date());
                }}
                onSell={async () => {
                  await api.sale.create({
                    sale_lines: [],
                  });
                }}
              />
            ))}
            <InventoryTableRow
              editable={true}
              inventoryItem={newItem}
              onChange={(item) => setNewItem(item)}
              onSave={async () => {
                const data = await api.inventoryItem.create(newItem);
                setItems([...items, data]);
              }}
              onPurchase={() => void 0}
              onSell={() => void 0}
            />
          </tbody>
        </table>
      </div>
      <div className="recipe-section">
        <h2>Recipes</h2>
        {recipes[0] && (
          <RecipeCard
            recipe={recipes[0]}
            onCook={async (recipe) => {
              await api.batch.create({ recipe: recipe.id });
              setLastInventoryActionTime(new Date());
            }}
          />
        )}
      </div>
      <div className="sales-section">
        <h2>Sales</h2>
        <table className="pure-table pure-table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Cost</th>
              <th>Revenue</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((s) => {
              return (
                <tr>
                  <td>{s.id}</td>
                  <td>{s.created_at}</td>
                  <td>{s.sale_lines[0].cost_cents}</td>
                  <td>{s.sale_lines[0].price_cents}</td>
                  <td>
                    {s.sale_lines[0].price_cents - s.sale_lines[0].cost_cents}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
