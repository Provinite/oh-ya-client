import * as React from "react";
import { FunctionComponent } from "react";
import { InventoryItem } from "../api/InventoryItem";
import "./InventoryTableRow.css";
export interface InventoryTableRowProps {
  editable: boolean;
  inventoryItem: Partial<InventoryItem>;
  onChange: (inventoryItem: Partial<InventoryItem>) => void;
  onSave: () => void;
  onPurchase: () => void;
  onSell: () => void;
}
export const InventoryTableRow: FunctionComponent<InventoryTableRowProps> = ({
  editable,
  inventoryItem,
  onChange,
  onSave,
  onPurchase,
  onSell,
}: InventoryTableRowProps) => {
  if (!editable) {
    return (
      <tr key={inventoryItem.id}>
        <td>{inventoryItem.id}</td>
        <td>{inventoryItem.name}</td>
        <td>{inventoryItem.stock}</td>
        <td>{inventoryItem.can_purchase ? inventoryItem.cost_cents : "N/A"}</td>
        <td>{inventoryItem.for_sale ? inventoryItem.price_cents : "N/A"}</td>
        <td>
          {inventoryItem.can_purchase && (
            <button
              className="pure-button pure-button-secondary"
              onClick={onPurchase}
            >
              Buy
            </button>
          )}
          {inventoryItem.for_sale && (
            <button
              className="pure-button pure-button-primary"
              onClick={onSell}
            >
              Sell
            </button>
          )}
        </td>
      </tr>
    );
  } else {
    return (
      <tr>
        <td>{inventoryItem.id !== undefined ? inventoryItem.id : "#"}</td>
        <td>
          <input
            type="text"
            value={inventoryItem.name || ""}
            onChange={(e) => {
              onChange({ ...inventoryItem, name: e.target.value });
            }}
          />
        </td>
        <td>
          <input
            type="number"
            value={inventoryItem.cost_cents || 0}
            onChange={(e) =>
              onChange({
                ...inventoryItem,
                cost_cents: parseInt(e.target.value, 10),
              })
            }
          />
        </td>
        <td>
          <input
            type="number"
            value={inventoryItem.price_cents || 0}
            onChange={(e) =>
              onChange({
                ...inventoryItem,
                price_cents: parseInt(e.target.value, 10),
              })
            }
          />
        </td>
        <td>
          <input
            type="number"
            value={inventoryItem.stock || 0}
            onChange={(e) =>
              onChange({
                ...inventoryItem,
                stock: parseInt(e.target.value, 10),
              })
            }
          />
        </td>
        <td>
          <button className="pure-button pure-button-primary" onClick={onSave}>
            Add
          </button>
        </td>
      </tr>
    );
  }
};
