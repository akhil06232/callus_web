import { crops, products, type Crop, type Product, type InsertCrop, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getCrop(id: number): Promise<Crop | undefined>;
  getCropByName(name: string): Promise<Crop | undefined>;
  getCropByNftId(nftId: string): Promise<Crop | undefined>;
  createCrop(crop: InsertCrop): Promise<Crop>;
  
  getProduct(id: number): Promise<Product | undefined>;
  getProductByCropName(cropName: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
}

export class MemStorage implements IStorage {
  private crops: Map<number, Crop>;
  private products: Map<number, Product>;
  private currentCropId: number;
  private currentProductId: number;

  constructor() {
    this.crops = new Map();
    this.products = new Map();
    this.currentCropId = 1;
    this.currentProductId = 1;
    
    // Initialize with sample data
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Sample crops
    const sampleCrops: InsertCrop[] = [
      { name: "Tomato", nftId: "124", variety: "Heritage" },
      { name: "Lettuce", nftId: "456", variety: "Organic" },
      { name: "Carrot", nftId: "789", variety: "Rainbow" },
    ];

    // Sample products
    const sampleProducts: InsertProduct[] = [
      {
        title: "Fresh Organic Tomato Box",
        price: "19,000 KRW",
        image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&h=300",
        buyLink: "https://your-mockshop.com/product/123",
        description: "Premium organic tomatoes grown with sustainable farming practices",
        cropName: "tomato"
      },
      {
        title: "Crisp Organic Lettuce Bundle",
        price: "12,000 KRW",
        image: "https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        buyLink: "https://your-mockshop.com/product/124",
        description: "Fresh crisp lettuce perfect for salads and sandwiches",
        cropName: "lettuce"
      },
      {
        title: "Rainbow Carrot Variety Pack",
        price: "15,000 KRW",
        image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        buyLink: "https://your-mockshop.com/product/125",
        description: "Colorful rainbow carrots with rich flavor and nutrients",
        cropName: "carrot"
      }
    ];

    // Initialize crops
    for (const crop of sampleCrops) {
      await this.createCrop(crop);
    }

    // Initialize products
    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  async getCrop(id: number): Promise<Crop | undefined> {
    return this.crops.get(id);
  }

  async getCropByName(name: string): Promise<Crop | undefined> {
    return Array.from(this.crops.values()).find(
      (crop) => crop.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getCropByNftId(nftId: string): Promise<Crop | undefined> {
    return Array.from(this.crops.values()).find(
      (crop) => crop.nftId === nftId
    );
  }

  async createCrop(insertCrop: InsertCrop): Promise<Crop> {
    const id = this.currentCropId++;
    const crop: Crop = { 
      ...insertCrop, 
      id,
      variety: insertCrop.variety || null
    };
    this.crops.set(id, crop);
    return crop;
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductByCropName(cropName: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.cropName.toLowerCase() === cropName.toLowerCase()
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      description: insertProduct.description || null
    };
    this.products.set(id, product);
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
}

export const storage = new MemStorage();
