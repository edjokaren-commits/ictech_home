import fs from "node:fs/promises";
import path from "node:path";
import { PRODUCTS, type Product } from "@/data/products";

const DATA_DIR = path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");

let writeQueue: Promise<void> = Promise.resolve();

async function ensureProductsFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(PRODUCTS_FILE);
  } catch {
    await atomicWriteJson(PRODUCTS_FILE, PRODUCTS);
  }
}

async function atomicWriteJson(filePath: string, data: unknown): Promise<void> {
  const run = async () => {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tmpPath, JSON.stringify(data, null, 2), "utf-8");
    await fs.rename(tmpPath, filePath);
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue;
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    await ensureProductsFile();
    const raw = await fs.readFile(PRODUCTS_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return (parsed as Product[]).map((item) =>
        item.category === "module" && item.categoryLabel === "기타 장치"
          ? { ...item, categoryLabel: "케이스 및 기타" }
          : item
      );
    }
    return PRODUCTS;
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const list = await getAllProducts();
  return list.find((p) => p.slug === slug);
}

export async function saveAllProducts(list: Product[]): Promise<void> {
  await atomicWriteJson(PRODUCTS_FILE, list);
}

export async function addOrUpdateProduct(product: Product): Promise<Product[]> {
  const list = await getAllProducts();
  const idx = list.findIndex((p) => p.slug === product.slug);
  let next: Product[];
  if (idx >= 0) {
    next = [...list];
    next[idx] = product;
  } else {
    next = [product, ...list];
  }
  await saveAllProducts(next);
  return next;
}

export async function deleteProductBySlug(slug: string): Promise<Product[]> {
  const list = await getAllProducts();
  const next = list.filter((p) => p.slug !== slug);
  await saveAllProducts(next);
  return next;
}

export async function resetDefaultProducts(): Promise<Product[]> {
  await saveAllProducts(PRODUCTS);
  return PRODUCTS;
}
