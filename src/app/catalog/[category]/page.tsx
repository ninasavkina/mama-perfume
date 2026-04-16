import Link from "next/link";
import { getCategories, getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import { notFound } from "next/navigation";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categories = getCategories();
  const currentCategory = categories.find((c) => c.slug === category);

  if (!currentCategory) {
    notFound();
  }

  const products = getProductsByCategory(category);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="md:w-56 shrink-0">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Категорії</h2>
          <nav className="space-y-1">
            <Link
              href="/catalog"
              className="block px-3 py-2 rounded-lg text-sm hover:bg-pink-50 hover:text-pink-600 text-gray-600"
            >
              Всі товари
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog/${cat.slug}`}
                className={`block px-3 py-2 rounded-lg text-sm ${
                  cat.slug === category
                    ? "bg-pink-50 text-pink-600 font-medium"
                    : "hover:bg-pink-50 hover:text-pink-600 text-gray-600"
                }`}
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </nav>
        </aside>

        {/* Products */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{currentCategory.name}</h1>
            <span className="text-gray-500 text-sm">{products.length} товарів</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const categories = getCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}
