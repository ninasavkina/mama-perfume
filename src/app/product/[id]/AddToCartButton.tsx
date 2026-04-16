"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button
      onClick={handleAdd}
      className={`w-full py-3 rounded-xl font-semibold text-lg transition-colors ${
        added
          ? "bg-green-500 text-white"
          : "bg-pink-600 text-white hover:bg-pink-700"
      }`}
    >
      {added ? "Додано в кошик ✓" : "Додати в кошик"}
    </button>
  );
}
