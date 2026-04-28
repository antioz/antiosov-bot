const MENU_BUTTONS = [
  [{ type: 'callback', text: '🤖 Поддержка', payload: 'support' }],
  [{ type: 'callback', text: '📦 Статус заказа', payload: 'orders' }],
  [{ type: 'callback', text: '🧀 Наш колбасный сыр', payload: 'cheese' }],
  [{ type: 'callback', text: '🎲 Случайный смайл', payload: 'emoji' }],
  [{ type: 'open_app', text: '👤 О создателе', web_app: 'https://antioz.github.io/antiosov-bot/' }],
];

function getMenuKeyboard() {
  return MENU_BUTTONS;
}

const WELCOME_TEXT = `БОТ АНТИОСОВА 🤖

Я здесь чтобы помочь вам. Вам всем нужна помощь.
Выбери раздел:`;

module.exports = { getMenuKeyboard, WELCOME_TEXT };
