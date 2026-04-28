const MENU_BUTTONS = [
  [{ text: '🤖 Поддержка', payload: 'support' }],
  [{ text: '📦 Статус заказа', payload: 'orders' }],
  [{ text: '🧀 Наш колбасный сыр', payload: 'cheese' }],
  [{ text: '🎲 Случайный смайл', payload: 'emoji' }],
  [{ text: '👤 О создателе', payload: 'about' }],
];

function getMenuKeyboard() {
  return {
    type: 'inline',
    buttons: MENU_BUTTONS,
  };
}

const WELCOME_TEXT = `БОТ АНТИОСОВА 🤖

Привет! Я демонстрирую возможности мессенджер-ботов.
Выбери раздел:`;

module.exports = { getMenuKeyboard, WELCOME_TEXT };
