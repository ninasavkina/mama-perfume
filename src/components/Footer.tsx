export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-lg font-semibold text-white mb-2">Parfum Shop</p>
        <p className="text-sm">Оригінальна парфумерія за найкращими цінами</p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <a href="tel:+380000000000" className="hover:text-pink-400">
            Телефон
          </a>
          <a href="https://t.me/" className="hover:text-pink-400">
            Telegram
          </a>
          <a href="https://www.instagram.com/" className="hover:text-pink-400">
            Instagram
          </a>
        </div>
        <p className="mt-6 text-xs text-gray-600">
          &copy; {new Date().getFullYear()} Parfum Shop. Всі права захищені.
        </p>
      </div>
    </footer>
  );
}
