"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    delivery: "nova-poshta",
    comment: "",
  });

  if (items.length === 0 && !sent) {
    router.push("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          total,
        }),
      });

      if (response.ok) {
        setSent(true);
        clearCart();
      } else {
        alert("Помилка при відправці замовлення. Спробуйте ще раз.");
      }
    } catch {
      alert("Помилка при відправці замовлення. Спробуйте ще раз.");
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">&#10003;</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Замовлення прийнято!</h1>
        <p className="text-gray-500 mb-6">
          Ми зв'яжемось з вами найближчим часом для підтвердження.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700"
        >
          На головну
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Оформлення замовлення</h1>

      {/* Order summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <h2 className="font-semibold text-gray-800 mb-3">Ваше замовлення</h2>
        {items.map((item) => (
          <div key={item.product.id} className="flex justify-between py-2 text-sm">
            <span className="text-gray-600">
              {item.product.name} x{item.quantity}
            </span>
            <span className="font-medium">{item.product.price * item.quantity} грн</span>
          </div>
        ))}
        <div className="border-t mt-2 pt-2 flex justify-between font-bold text-lg">
          <span>Разом:</span>
          <span className="text-pink-600">{total} грн</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ім'я *
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400"
            placeholder="Ваше ім'я"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон *
          </label>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400"
            placeholder="+380..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Місто *
          </label>
          <input
            type="text"
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400"
            placeholder="Київ"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Доставка
          </label>
          <select
            value={form.delivery}
            onChange={(e) => setForm({ ...form, delivery: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400"
          >
            <option value="nova-poshta">Нова Пошта</option>
            <option value="ukrposhta">Укрпошта</option>
            <option value="pickup">Самовивіз</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Коментар
          </label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-pink-400"
            rows={3}
            placeholder="Номер відділення, побажання..."
          />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full py-3 bg-pink-600 text-white rounded-xl font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50"
        >
          {sending ? "Відправляємо..." : "Підтвердити замовлення"}
        </button>
      </form>
    </div>
  );
}
