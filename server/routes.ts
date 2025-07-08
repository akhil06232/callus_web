import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { cropSearchSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search for product by crop name or NFT ID
  app.post("/api/crops/search", async (req, res) => {
    try {
      const { cropInput } = cropSearchSchema.parse(req.body);
      
      // Parse the crop input to extract name and NFT ID
      const input = cropInput.trim().toLowerCase();
      let cropName = "";
      let nftId = "";
      
      // Check if input contains NFT ID pattern (e.g., "Tomato #124" or "Tomato#124")
      const nftMatch = input.match(/^(.+?)\s*#\s*(\d+)$/);
      if (nftMatch) {
        cropName = nftMatch[1].trim();
        nftId = nftMatch[2];
      } else {
        cropName = input;
      }
      
      // Search for matching product
      const product = await storage.getProductByCropName(cropName);
      
      if (!product) {
        return res.status(404).json({ 
          message: `No matching product found for "${cropInput}"` 
        });
      }
      
      // Return the response in the expected format
      const response = {
        crop: cropInput,
        matchedProduct: {
          title: product.title,
          price: product.price,
          image: product.image,
          buyLink: product.buyLink
        }
      };
      
      res.json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
