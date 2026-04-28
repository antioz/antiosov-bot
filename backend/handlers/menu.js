const MENU_BUTTONS = [
  [{ type: 'callback', text: '🤖 Поддержка', payload: 'support' }],
  [{ type: 'callback', text: '📦 Статус заказа', payload: 'orders' }],
  [{ type: 'callback', text: '🧀 Наш колбасный сыр', payload: 'cheese' }],
  [{ type: 'callback', text: '🎲 Случайный смайл', payload: 'emoji' }],
  [{ type: 'callback', text: '👤 О создателе', payload: 'about' }],
];

function getMenuKeyboard() {
  return MENU_BUTTONS;
}

const WELCOME_TEXT = `БОТ АНТИОСОВА 🤖

Я здесь чтобы помочь вам. Вам всем нужна помощь.
Выбери раздел:`;

module.exports = { getMenuKeyboard, WELCOME_TEXT };
