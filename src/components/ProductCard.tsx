"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-pink-600 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1">{product.categoryName}</p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-lg font-bold text-pink-600">{product.price} грн</span>
          <button
            onClick={() => addToCart(product)}
            className="px-3 py-1.5 bg-pink-600 text-white text-sm rounded-lg hover:bg-pink-700 transition-colors"
          >
            В кошик
          </button>
        </div>
      </div>
    </div>
  );
}
