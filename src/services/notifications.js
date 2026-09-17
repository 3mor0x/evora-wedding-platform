const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '8813613824:AAEvMWOUXB8W_6cCCXojl4nQskNIIbNGNLY';
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '7197760143';

export async function sendTelegramNotification(order) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  const text = 
    `💍 *طلب حجز جديد في إيفورا | Evora*\n\n` +
    `🔢 *كود الطلب:* \`${order.orderCode}\`\n` +
    `👰🤵 *العروسين:* ${order.groomName} & ${order.brideName}\n` +
    `📋 *النموذج:* ${order.invitationTitle}\n` +
    `📅 *الموعد:* ${order.eventDate} ${order.eventTime ? `(${order.eventTime})` : ''}\n` +
    `📍 *المكان:* ${order.venueName}\n` +
    `💳 *الدفع:* ${order.paymentMethod === 'instapay' ? 'InstaPay' : 'فودافون كاش'}\n` +
    `📱 *واتساب العميل:* https://wa.me/2${order.clientWhatsapp}\n` +
    (order.receiptUrl ? `🧾 *إيصال التحويل:* [معاينة الإيصال](${order.receiptUrl})\n` : '') +
    (order.notes ? `📝 *ملاحظات:* ${order.notes}\n` : '');

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}