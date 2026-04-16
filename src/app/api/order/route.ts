import { NextRequest } from "next/server";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";

async function sendTelegramMessage(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("Telegram not configured, skipping notification");
    return;
  }

  await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const order = await request.json();

    const { name, phone, city, delivery, comment, items, total } = order;

    if (!name || !phone || !city || !items?.length) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const deliveryMap: Record<string, string> = {
      "nova-poshta": "Нова Пошта",
      ukrposhta: "Укрпошта",
      pickup: "Самовивіз",
    };

    const itemsList = items
      .map(
        (item: { name: string; price: number; quantity: number }) =>
          `  - ${item.name} x${item.quantity} = ${item.price * item.quantity} грн`
      )
      .join("\n");

    const message = `<b>Нове замовлення!</b>

<b>Клієнт:</b> ${name}
<b>Телефон:</b> ${phone}
<b>Місто:</b> ${city}
<b>Доставка:</b> ${deliveryMap[delivery] || delivery}
${comment ? `<b>Коментар:</b> ${comment}` : ""}

<b>Товари:</b>
${itemsList}

<b>Сума: ${total} грн</b>`;

    await sendTelegramMessage(message);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Order error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
