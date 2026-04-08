// ❌ 'use client' on a component that just renders data
"use client";
export default function ProductCard({ product }) {
  return <div>{product.name}</div>; // no interactivity — RSC is fine
}
