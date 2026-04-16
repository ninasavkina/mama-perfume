import Link from "next/link";
import { getCategories, getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const categories = getCategories();
  const products = getProducts();
  const featured = products.slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Parfum Shop
          </h1>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Оригінальна парфумерія за найкращими цінами. Тестери, ручки-спреї, масла абсолю.
          </p>
          <Link
            href="/catalog"
            className="inline-block px-8 py-3 bg-white text-pink-600 font-semibold rounded-full hover:bg-pink-50 transition-colors"
          >
            Переглянути каталог
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Категорії</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog/${cat.slug}`}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{cat.count} товарів</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Новинки</h2>
          <Link href="/catalog" className="text-pink-600 hover:text-pink-700 font-medium">
            Дивитись всі →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
