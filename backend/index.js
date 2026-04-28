require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { getMenuKeyboard, WELCOME_TEXT } = require('./handlers/menu');
const { getToneButtons, getTonePrompt, handleSupport } = require('./handlers/support');
const { handleCheese } = require('./handlers/cheese');
const { handleOrderStatus } = require('./handlers/orders');
const { getRandomEmoji } = require('./handlers/emoji');
const { ERROR_TEXT } = require('./ai');

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.MAX_BOT_TOKEN;
const MINIAPP_URL = process.env.MINIAPP_URL || 'https://antioz.github.io/antiosov-bot/';
const MAX_API = 'https://platform-api.max.ru';

const userState = new Map();

async function sendMessage(recipientId, text, keyboard = null, useChat = false) {
  const body = { text };
  if (keyboard) body.attachments = [keyboard];
  const param = useChat ? `chat_id=${recipientId}` : `user_id=${recipientId}`;
  try {
    await axios.post(`${MAX_API}/messages?${param}`, body, {
      headers: { Authorization: BOT_TOKEN },
    });
  } catch (err) {
    console.error('sendMessage error:', err.response?.data || err.message);
  }
}

function makeKeyboard(buttons) {
  return {
    type: 'inline_keyboard',
    payload: { buttons },
  };
}

async function handleUpdate(update) {
  const type = update.update_type;

  if (type === 'bot_started') {
    const userId = update.user?.user_id;
    if (!userId) return;
    userState.set(userId, {});
    await sendMessage(userId, WELCOME_TEXT, makeKeyboard(getMenuKeyboard()));
    return;
  }

  if (type === 'message_created') {
    const msg = update.message;
    const chatId = msg?.recipient?.chat_id;
    const userId = msg?.sender?.user_id;
    const recipientId = chatId || userId;
    const useChat = !!chatId;
    const text = msg?.body?.text || '';
    if (!recipientId) return;

    const stateKey = userId || recipientId;
    const state = userState.get(stateKey) || {};

    if (text === '/start' || text === '/меню' || text === '/menu') {
      userState.set(stateKey, {});
      await sendMessage(recipientId, WELCOME_TEXT, makeKeyboard(getMenuKeyboard()), useChat);
      return;
    }

    if (state.mode === 'support' && state.tonePrompt) {
      const reply = await handleSupport(state.tonePrompt, text);
      await sendMessage(recipientId, reply, makeKeyboard([[{ type: 'callback', text: '↩ Главное меню', payload: 'menu' }]]), useChat);
      return;
    }

    if (state.mode === 'orders') {
      const reply = handleOrderStatus(text);
      userState.set(stateKey, {});
      await sendMessage(recipientId, reply, makeKeyboard([[{ type: 'callback', text: '↩ Главное меню', payload: 'menu' }]]), useChat);
      return;
    }

    if (state.mode === 'cheese') {
      const result = await handleCheese(text);
      if (typeof result === 'string') {
        await sendMessage(recipientId, result, makeKeyboard([[{ type: 'callback', text: '↩ Главное меню', payload: 'menu' }]]), useChat);
      } else {
        await sendMessage(recipientId, result.loading, null, useChat);
        await sendMessage(recipientId, result.answer, makeKeyboard([[{ type: 'callback', text: '↩ Главное меню', payload: 'menu' }]]), useChat);
      }
      return;
    }

    await sendMessage(recipientId, WELCOME_TEXT, makeKeyboard(getMenuKeyboard()), useChat);
  }

  if (type === 'message_callback') {
    const cb = update.callback;
    const userId = cb?.user?.user_id;
    const payload = cb?.payload;
    if (!userId || !payload) return;
    const chatId = userId;

    if (payload === 'support') {
      userState.set(chatId, { mode: 'support_tone' });
      await sendMessage(chatId, 'Выбери тон общения:', makeKeyboard(getToneButtons().map(b => [b])));
      return;
    }

    if (payload?.startsWith('tone_')) {
      const toneKey = payload.replace('tone_', '');
      userState.set(chatId, { mode: 'support', tonePrompt: getTonePrompt(toneKey) });
      await sendMessage(chatId, 'Готов! Напиши свой вопрос. Для выхода — /меню');
      return;
    }

    if (payload === 'orders') {
      userState.set(chatId, { mode: 'orders' });
      await sendMessage(chatId, '📦 Введи номер заказа (например: ANT-001):');
      return;
    }

    if (payload === 'cheese') {
      userState.set(chatId, { mode: 'cheese' });
      await sendMessage(chatId, '🧀 Задай вопрос про Антиосов колбасный сыр:');
      return;
    }

    if (payload === 'emoji') {
      await sendMessage(chatId, getRandomEmoji());
      return;
    }

    if (payload === 'about') {
      await sendMessage(chatId, `👤 О создателе\n\n${MINIAPP_URL}`);
      return;
    }

    if (payload === 'menu') {
      userState.set(chatId, {});
      await sendMessage(chatId, WELCOME_TEXT, makeKeyboard(getMenuKeyboard()));
      return;
    }
  }
}

app.post('/webhook', async (req, res) => {
  res.sendStatus(200);
  try {
    await handleUpdate(req.body);
  } catch (err) {
    console.error('Unhandled error:', err.message);
  }
});

app.get('/', (req, res) => res.send('БОТ АНТИОСОВА работает ✓'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
