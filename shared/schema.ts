import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const crops = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nftId: text("nft_id").notNull().unique(),
  variety: text("variety"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  buyLink: text("buy_link").notNull(),
  description: text("description"),
  cropName: text("crop_name").notNull(),
});

export const insertCropSchema = createInsertSchema(crops).pick({
  name: true,
  nftId: true,
  variety: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  title: true,
  price: true,
  image: true,
  buyLink: true,
  description: true,
  cropName: true,
});

export const cropSearchSchema = z.object({
  cropInput: z.string().min(1, "Crop name or NFT ID is required"),
});

export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof crops.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type CropSearch = z.infer<typeof cropSearchSchema>;

export interface ProductMatchResponse {
  crop: string;
  matchedProduct: {
    title: string;
    price: string;
    image: string;
    buyLink: string;
  };
}
