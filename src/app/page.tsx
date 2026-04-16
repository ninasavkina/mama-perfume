import Link from "next/link";
import { getCategories, getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import HomeHero from "@/components/HomeHero";
import AnimatedSection from "@/components/AnimatedSection";

const CATEGORY_ICONS: Record<string, string> = {
  "50ml-premium-tester": "\u{1F48E}",
  "50ml-craft-tester": "\u{1F3A8}",
  "50ml-timms": "\u2B50",
  "60ml-brown-tester": "\u{1F451}",
  "10ml-ruchki-na-blistere": "\u{1F58A}\uFE0F",
  "ruchki-20ml": "\u2728",
  "10ml-maslo-absolju-new": "\u{1F4A7}",
};

export default function Home() {
  const categories = getCategories();
  const products = getProducts();
  const featured = products.slice(0, 8);
  const popular = products
    .filter((p) => p.description && p.description.length > 10)
    .slice(0, 4);

  return (
    <div>
      {/* Hero with parallax & flowers */}
      <HomeHero />

      {/* Categories with staggered animations */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Наші категорії
          </h2>
          <p className="text-gray-500 text-center mb-10">
            Оберіть те, що вам до вподоби
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <AnimatedSection key={cat.slug} delay={i * 100}>
              <Link
                href={`/catalog/${cat.slug}`}
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-center overflow-hidden hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <span className="text-4xl mb-3 block">
                    {CATEGORY_ICONS[cat.slug] || "\u{1F338}"}
                  </span>
                  <h3 className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{cat.count} товарів</p>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Banner with parallax feel */}
      <AnimatedSection>
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500" />
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjMiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNS41MTQgMC0xMC00LjQ4Ni0xMC0xMHM0LjQ4Ni0xMCAxMC0xMCAxMCA0LjQ4NiAxMCAxMC00LjQ4NiAxMC0xMCAxMHoiLz48L2c+PC9nPjwvc3ZnPg==')] bg-repeat" />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Тільки оригінальна парфумерія
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Кожен аромат — це маленька подорож. Знайди свій ідеальний парфум серед 1500+ варіантів.
            </p>
            <Link
              href="/catalog"
              className="inline-block px-8 py-4 bg-white text-pink-600 font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-pulse-glow"
            >
              Обрати аромат
            </Link>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Новинки</h2>
              <p className="text-gray-500 mt-1">Найсвіжіші надходження</p>
            </div>
            <Link
              href="/catalog"
              className="text-pink-600 hover:text-pink-700 font-medium px-4 py-2 rounded-full border border-pink-200 hover:bg-pink-50 transition-all"
            >
              Дивитись всі →
            </Link>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {featured.map((product, i) => (
            <AnimatedSection key={product.id} delay={i * 80}>
              <ProductCard product={product} />
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Why us section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
              Чому обирають нас
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "\u{1F48E}",
                title: "100% оригінал",
                desc: "Тільки сертифікована продукція від перевірених постачальників",
              },
              {
                icon: "\u{1F69A}",
                title: "Швидка доставка",
                desc: "Нова Пошта та Укрпошта по всій Україні за 1-3 дні",
              },
              {
                icon: "\u{1F4B0}",
                title: "Найкращі ціни",
                desc: "Прямі поставки без посередників — економія до 50%",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="text-center p-8 rounded-2xl hover:bg-pink-50 transition-colors duration-300">
                  <span className="text-5xl mb-4 block">{item.icon}</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-500">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection>
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="relative bg-gradient-to-br from-pink-500 to-purple-600 rounded-3xl p-12 overflow-hidden">
            <div className="absolute top-4 left-8 text-4xl opacity-30 animate-float">{"\u{1F338}"}</div>
            <div className="absolute top-8 right-12 text-3xl opacity-30 animate-float" style={{ animationDelay: "1s" }}>{"\u{1F33A}"}</div>
            <div className="absolute bottom-6 left-16 text-3xl opacity-30 animate-float" style={{ animationDelay: "2s" }}>{"\u{1F337}"}</div>
            <div className="absolute bottom-4 right-8 text-4xl opacity-30 animate-float" style={{ animationDelay: "0.5s" }}>{"\u{1F33C}"}</div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
              Готові обрати свій аромат?
            </h2>
            <p className="text-white/80 text-lg mb-8 relative z-10">
              Понад 1500 парфумів чекають на вас
            </p>
            <Link
              href="/catalog"
              className="relative z-10 inline-block px-10 py-4 bg-white text-pink-600 font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Перейти до каталогу
            </Link>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
