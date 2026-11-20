import { writeFile } from "node:fs/promises";
import { products } from "../src/data/products.js";

const demoUsers = [{ id: 1, name: "Alex Morgan", email: "alex@rcverse.demo", password: "demo1234" }];
await writeFile(new URL("../db.json", import.meta.url), `${JSON.stringify({ products, users: demoUsers, orders: [] }, null, 2)}\n`);
console.log(`Wrote ${products.length} products and ${demoUsers.length} demo user to db.json.`);
