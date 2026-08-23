"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function CartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("novashop-cart") ?? "[]");
        setCount(Array.isArray(cart) ? cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0) : 0);
      } catch {
        setCount(0);
      }
    };
    update();
    window.addEventListener("novashop-cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("novashop-cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return <Link href="/cart">Cart {count > 0 && <span className="navCount">{count}</span>}</Link>;
}
