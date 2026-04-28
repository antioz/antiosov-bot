const orders = require('../orders.json');
const { ERROR_TEXT } = require('../ai');

function handleOrderStatus(orderId) {
  const id = orderId.trim().toUpperCase();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return `Заказ ${id} не найден. Проверь номер и попробуй ещё раз.\n\nЕсли проблема не решается — напиши нам напрямую.`;
  }

  return `📦 Заказ ${order.id}\n\nСостав: ${order.items}\nСтатус: ${order.status}\nДата: ${order.date}`;
}

module.exports = { handleOrderStatus };
