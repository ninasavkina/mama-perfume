const fetch = require("node-fetch");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://reva4ever.com";
const PRICE_MULTIPLIER = 1.3; // +30%

const CATEGORIES = [
  {
    slug: "50ml-premium-tester",
    name: "Тестери 50мл Premium",
    pages: 6,
  },
  {
    slug: "50ml-craft-tester",
    name: "Тестери 50мл Craft",
    pages: 3,
  },
  {
    slug: "50ml-no-box-tester",
    name: "Тестери 50мл No Box",
    pages: 1,
  },
  {
    slug: "50ml-timms",
    name: "Тестери 50мл TIMMS",
    pages: 7,
  },
  {
    slug: "60ml-brown-tester",
    name: "Тестери 60мл Brown",
    pages: 6,
  },
  {
    slug: "10ml-ruchki-na-blistere",
    name: "Ручки-спреї 10мл",
    pages: 3,
  },
  {
    slug: "ruchki-20ml",
    name: "Ручки-спреї 20мл",
    pages: 7,
  },
  {
    slug: "10ml-maslo-absolju-new",
    name: "Масла абсолю 10мл",
    pages: 24,
  },
];

function roundPrice(price) {
  return Math.ceil(price * PRICE_MULTIPLIER / 5) * 5; // round up to nearest 5
}

async function fetchPage(url) {
  console.log(`  Fetching: ${url}`);
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
  });
  return await res.text();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseProducts(html, categorySlug, categoryName) {
  const $ = cheerio.load(html);
  const products = [];

  // uCoz shop uses specific structure - find product entries
  // Products are typically in .shop-items or similar containers
  // Let's try multiple selectors

  // Try to extract from script data first
  const scriptContent = html.match(/sh_goods\s*=\s*(\[[\s\S]*?\]);/);
  if (scriptContent) {
    try {
      const goodsData = eval(scriptContent[1]);
      // This would give us structured data
    } catch (e) {
      // fallback to HTML parsing
    }
  }

  // Parse product links and data from HTML
  const productLinks = [];
  $("a").each((i, el) => {
    const href = $(el).attr("href") || "";
    if (href.includes("/desc/") && href.includes("/shop/")) {
      const name = $(el).text().trim();
      if (name && name.length > 5 && !productLinks.find((p) => p.href === href)) {
        productLinks.push({ href, name });
      }
    }
  });

  // Extract prices - they appear as text like "153грн."
  const priceRegex = /(\d+)\s*грн/g;
  const allText = $.text();

  // For each product link, try to find associated image and price
  productLinks.forEach((link, idx) => {
    // Find image near this product
    const productId = link.href.match(/\/shop\/(\d+)\//)?.[1];
    if (!productId) return;

    const imageUrl = `${BASE_URL}/_sh/${productId.substring(0, 3)}/${productId}m.webp`;
    const imageUrlFull = `${BASE_URL}/_sh/${productId.substring(0, 3)}/${productId}.webp`;

    // Extract price from nearby text
    let price = 0;
    $(`a[href="${link.href}"]`)
      .closest("div")
      .find("strong, .shop-price, b")
      .each((i, el) => {
        const text = $(el).text();
        const match = text.match(/(\d+)\s*грн/);
        if (match) price = parseInt(match[1]);
      });

    // If we couldn't find price in the structured way, try parent elements
    if (!price) {
      const parentDiv = $(`a[href="${link.href}"]`).parent().parent();
      const parentText = parentDiv.text();
      const priceMatch = parentText.match(/(\d+)\s*грн/);
      if (priceMatch) price = parseInt(priceMatch[1]);
    }

    products.push({
      id: productId,
      name: link.name,
      originalPrice: price,
      price: roundPrice(price),
      image: imageUrl,
      imageFull: imageUrlFull,
      category: categorySlug,
      categoryName: categoryName,
      url: `${BASE_URL}${link.href}`,
    });
  });

  return products;
}

async function scrapeCategory(category) {
  console.log(`\nScraping: ${category.name} (${category.slug})`);
  let allProducts = [];

  for (let page = 1; page <= category.pages; page++) {
    const url =
      page === 1
        ? `${BASE_URL}/shop/${category.slug}`
        : `${BASE_URL}/shop/${category.slug};${page}`;

    try {
      const html = await fetchPage(url);
      const products = parseProducts(html, category.slug, category.name);
      console.log(`  Page ${page}: found ${products.length} products`);
      allProducts = allProducts.concat(products);
      await delay(500); // be polite
    } catch (err) {
      console.error(`  Error on page ${page}: ${err.message}`);
    }
  }

  return allProducts;
}

async function scrapeProductDetails(product) {
  try {
    const html = await fetchPage(product.url);
    const $ = cheerio.load(html);

    // Get description
    let description = "";
    $(".shop-desc, .uDesc, .descr, .description, p").each((i, el) => {
      const text = $(el).text().trim();
      if (text.length > 50 && text.length < 2000 && !description) {
        description = text;
      }
    });

    // Get additional images
    const images = [product.image];
    $("img").each((i, el) => {
      const src = $(el).attr("src") || "";
      if (src.includes("/_sh/") && src.includes(product.id) && !images.includes(BASE_URL + src)) {
        images.push(BASE_URL + src);
      }
    });

    return { ...product, description, images };
  } catch (err) {
    return { ...product, description: "", images: [product.image] };
  }
}

async function main() {
  console.log("Starting scraper...\n");

  let allProducts = [];

  for (const category of CATEGORIES) {
    const products = await scrapeCategory(category);
    allProducts = allProducts.concat(products);
  }

  // Remove duplicates by ID
  const uniqueProducts = [];
  const seen = new Set();
  for (const p of allProducts) {
    if (!seen.has(p.id)) {
      seen.add(p.id);
      uniqueProducts.push(p);
    }
  }

  console.log(`\nTotal unique products: ${uniqueProducts.length}`);

  // Scrape details for first 50 products (to get descriptions)
  // Full scrape of all products would take too long
  console.log("\nScraping product details (first 50 for descriptions)...");
  const detailedProducts = [];

  for (let i = 0; i < Math.min(50, uniqueProducts.length); i++) {
    const detailed = await scrapeProductDetails(uniqueProducts[i]);
    detailedProducts.push(detailed);
    if (i % 10 === 0) console.log(`  ${i}/${Math.min(50, uniqueProducts.length)}`);
    await delay(300);
  }

  // For the rest, keep basic info
  for (let i = 50; i < uniqueProducts.length; i++) {
    detailedProducts.push({
      ...uniqueProducts[i],
      description: "",
      images: [uniqueProducts[i].image],
    });
  }

  // Save data
  const outputPath = path.join(__dirname, "..", "src", "data");
  fs.mkdirSync(outputPath, { recursive: true });

  fs.writeFileSync(
    path.join(outputPath, "products.json"),
    JSON.stringify(detailedProducts, null, 2)
  );

  // Save categories
  const categories = CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: detailedProducts.filter((p) => p.category === c.slug).length,
  }));

  fs.writeFileSync(
    path.join(outputPath, "categories.json"),
    JSON.stringify(categories, null, 2)
  );

  console.log(`\nDone! Saved ${detailedProducts.length} products to src/data/products.json`);
  console.log(`Categories saved to src/data/categories.json`);
}

main().catch(console.error);
