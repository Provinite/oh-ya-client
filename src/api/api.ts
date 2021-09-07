import axios from "axios";
import { axiosClient } from "./axiosClient";
import { Batch } from "./Batch";
import { InventoryItem } from "./InventoryItem";
import { Recipe } from "./Recipe";
import { Sale } from "./Sale";
import { PartialDeep } from "type-fest";
import { Purchase } from "./Purchase";
export interface PaginationResult<T> {
  /**
   * True if a full page of data was returned. Indicates the API may have more data
   */
  hasMore: boolean;
  /**
   * The skip param to fetch the next page
   */
  nextSkip?: number;
  /**
   * The actual page of data
   */
  data: T[];
}
export const api = {
  inventoryItem: {
    /**
     * Create a new inventory item
     * @param data
     * @returns
     */
    async create(data: Partial<InventoryItem>): Promise<InventoryItem> {
      const { data: response } = await axiosClient.post(
        "/inventory-items",
        data
      );
      return response;
    },
    /**
     * Fetch a page of inventory items.
     * @param params
     * @returns
     */
    async findMany(
      params: { skip?: number; limit?: number } = {}
    ): Promise<PaginationResult<InventoryItem>> {
      const { data: response } = await axiosClient.get("/inventory-items", {
        params,
      });
      const nextSkip = (params.skip || 0) + response.length;
      return {
        data: response,
        nextSkip,
        hasMore: response.length === params.limit,
      };
    },
    async findOne(id: number): Promise<InventoryItem> {
      const { data: response } = await axiosClient.get(
        `/inventory-items/${id}`
      );
      return response;
    },
  },
  recipe: {
    async create(data: PartialDeep<Recipe>): Promise<Recipe> {
      const { data: response } = await axiosClient.post("/recipes", data);
      return response;
    },
    async findMany(
      params: { skip?: number; limit?: number } = {}
    ): Promise<PaginationResult<Recipe>> {
      const { data: response } = await axiosClient.get("/recipes", {
        params,
      });
      const nextSkip = (params.skip || 0) + response.length;
      return {
        data: response,
        nextSkip,
        hasMore: response.length === params.limit,
      };
    },
  },
  batch: {
    async create(data: Partial<Batch>): Promise<Batch> {
      const { data: response } = await axiosClient.post("/batches", data);
      return response;
    },
  },
  sale: {
    async create(data: PartialDeep<Sale>): Promise<Sale> {
      const { data: response } = await axiosClient.post("/sales", data);
      return response;
    },
    async findMany(
      params: { skip?: number; limit?: number } = {}
    ): Promise<PaginationResult<Sale>> {
      const { data: response } = await axiosClient.get("/sales", {
        params,
      });
      const nextSkip = (params.skip || 0) + response.length;
      return {
        data: response,
        nextSkip,
        hasMore: response.length === params.limit,
      };
    },
  },
  purchase: {
    async create(data: PartialDeep<Purchase>): Promise<Purchase> {
      const { data: response } = await axiosClient.post("/purchases", data);
      return response;
    },
  },
  async seed() {
    const lemonadePacket = await api.inventoryItem.create({
      cost_cents: 25,
      name: "Lemonade (Packet)",
    });
    const waterGallon = await api.inventoryItem.create({
      cost_cents: 100,
      name: "Water (Gallon)",
    });
    const lemonadeCup = await api.inventoryItem.create({
      price_cents: 100,
      name: "Lemonade (Cup)",
    });
    await api.recipe.create({
      output_item: lemonadeCup.id,
      quantity: 10,
      inputs: [
        {
          inventory_item: lemonadePacket.id,
          quantity: 2,
        },
        {
          inventory_item: waterGallon.id,
          quantity: 1,
        },
      ],
    });
  },
} as const;
