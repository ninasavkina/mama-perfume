"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Кошик порожній</h1>
        <p className="text-gray-500 mb-6">Додайте товари з каталогу</p>
        <Link
          href="/catalog"
          className="inline-block px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
        >
          Перейти до каталогу
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Кошик</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-xl p-4 shadow-sm flex gap-4 items-center"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.product.id}`}
                className="font-medium text-gray-800 hover:text-pink-600 line-clamp-1"
              >
                {item.product.name}
              </Link>
              <p className="text-sm text-gray-500">{item.product.categoryName}</p>
              <p className="font-bold text-pink-600 mt-1">{item.product.price} грн</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-gray-400 hover:text-red-500 ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Разом:</span>
          <span className="text-pink-600">{total} грн</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block w-full py-3 bg-pink-600 text-white text-center rounded-xl font-semibold hover:bg-pink-700 transition-colors"
        >
          Оформити замовлення
        </Link>
      </div>
    </div>
  );
}
