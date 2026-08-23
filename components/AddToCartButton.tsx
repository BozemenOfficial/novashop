"use client";

import { useState } from "react";

export function AddToCartButton({ product }: { product: { id:number; name:string; price:number } }) {
  const [added, setAdded] = useState(false);

  function add() {
    let cart: Array<{id:number;name:string;price:number;quantity:number}> = [];
    try {
      const parsed = JSON.parse(localStorage.getItem("novashop-cart") ?? "[]");
      if (Array.isArray(parsed)) cart = parsed;
    } catch {}
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity = Math.min(existing.quantity + 1, 20);
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("novashop-cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("novashop-cart-updated"));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return <button className={`btn addButton ${added ? "added" : ""}`} onClick={add}>{added ? "Added ✓" : "Add to cart"}</button>;
}
