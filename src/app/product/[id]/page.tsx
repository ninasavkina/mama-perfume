import { getProductById, getProducts } from "@/lib/products";
import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-600">Головна</Link>
        <span className="mx-2">→</span>
        <Link href={`/catalog/${product.category}`} className="hover:text-pink-600">
          {product.categoryName}
        </Link>
        <span className="mx-2">→</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <img
            src={product.image}
            alt={product.name}
            className="w-full aspect-square object-cover"
          />
        </div>

        {/* Info */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            {product.name}
          </h1>

          <p className="text-sm text-gray-500 mb-2">{product.categoryName}</p>

          <div className="text-3xl font-bold text-pink-600 mb-6">
            {product.price} грн
          </div>

          <AddToCartButton product={product} />

          {product.description && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Опис</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-pink-50 rounded-xl">
            <h3 className="font-semibold text-gray-800 mb-2">Доставка</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Нова Пошта — 1-3 дні</li>
              <li>Укрпошта — 3-7 днів</li>
              <li>Оплата при отриманні або на карту</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return getProducts().map((p) => ({ id: p.id }));
}
