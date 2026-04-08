// ✅ RSC by default — no directive needed
export default async function ProductList() {
  const products = await db.query("SELECT * FROM products");
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// ✅ Client only when needed
"use client";
import { useState } from "react";
export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}