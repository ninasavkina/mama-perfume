"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export default function Header() {
  const { count } = useCart();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      window.location.href = `/catalog?q=${encodeURIComponent(search.trim())}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold text-pink-600 shrink-0">
            Parfum Shop
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:flex">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Пошук парфумів..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-pink-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-600 text-white rounded-r-lg hover:bg-pink-700"
            >
              Знайти
            </button>
          </form>

          <div className="flex items-center gap-4">
            <Link href="/catalog" className="text-gray-600 hover:text-pink-600">
              Каталог
            </Link>
            <Link href="/cart" className="relative text-gray-600 hover:text-pink-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
