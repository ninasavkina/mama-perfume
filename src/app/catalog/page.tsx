import Link from "next/link";
import { getCategories, getProducts, searchProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const categories = getCategories();
  const products = q ? searchProducts(q) : getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Категорії</h2>
          <nav className="space-y-1">
            <Link
              href="/catalog"
              className="block px-3 py-2 rounded-lg text-sm hover:bg-pink-50 hover:text-pink-600 font-medium text-gray-700"
            >
              Всі товари ({getProducts().length})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                className="block px-3 py-2 rounded-lg text-sm hover:bg-pink-50 hover:text-pink-600 text-gray-600"
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </nav>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {q ? `Пошук: "${q}"` : "Всі товари"}
            </h1>
            <span className="text-gray-500 text-sm">{products.length} товарів</span>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Нічого не знайдено</p>
              <Link href="/catalog" className="text-pink-600 hover:text-pink-700 mt-2 inline-block">
                Повернутись до каталогу
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
