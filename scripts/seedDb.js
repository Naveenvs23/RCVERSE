import { writeFile } from "node:fs/promises";
import { products } from "../src/data/products.js";

// this demo account allows the review flow to be tried immediately. it is not
// a real credential and must never be replaced with a personal password.
const demoUsers = [{ id: 1, name: "Alex Morgan", email: "alex@rcverse.demo", password: "demo1234" }];
// create a clean json server database: current seed products, the demo user,
// and no prior orders. running this again resets local mock account/order data.
await writeFile(new URL("../db.json", import.meta.url), `${JSON.stringify({ products, users: demoUsers, orders: [] }, null, 2)}\n`);
console.log(`Wrote ${products.length} products and ${demoUsers.length} demo user to db.json.`);
