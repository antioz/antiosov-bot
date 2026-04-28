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
const MAX_API = `https://platform-api.max.ru`;

// Per-user state: { mode, tonePrompt, awaitingOrder }
const userState = new Map();

async function sendMessage(chatId, text, keyboard = null) {
  const body = { chat_id: chatId, text };
  if (keyboard) body.reply_markup = keyboard;
  try {
    await axios.post(`${MAX_API}/sendMessage`, body, {
      headers: { Authorization: BOT_TOKEN },
    });
  } catch (err) {
    console.error('sendMessage error:', err.response?.data || err.message);
  }
}

async function answerCallback(callbackId) {
  await axios.post(`${MAX_API}/answerCallbackQuery`, { callback_query_id: callbackId }, {
    headers: { Authorization: BOT_TOKEN },
  }).catch(() => {});
}

async function handleUpdate(update) {
  const msg = update.message;
  const cb = update.callback_query;

  const chatId = msg?.chat?.id || cb?.message?.chat?.id;
  if (!chatId) return;

  const state = userState.get(chatId) || {};

  // Callback button press
  if (cb) {
    await answerCallback(cb.id);
    const payload = cb.data || cb.payload;

    if (payload === 'support') {
      userState.set(chatId, { mode: 'support_tone' });
      await sendMessage(chatId, 'Выбери тон общения:', {
        type: 'inline',
        buttons: getToneButtons().map(b => [b]),
      });
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
      await sendMessage(chatId, WELCOME_TEXT, getMenuKeyboard());
      return;
    }
  }

  // Text message
  if (msg) {
    const text = msg.text || '';

    if (text === '/start' || text === '/меню' || text === '/menu') {
      userState.set(chatId, {});
      await sendMessage(chatId, WELCOME_TEXT, getMenuKeyboard());
      return;
    }

    if (state.mode === 'support' && state.tonePrompt) {
      const reply = await handleSupport(state.tonePrompt, text);
      await sendMessage(chatId, reply, {
        type: 'inline',
        buttons: [[{ text: '↩ Главное меню', payload: 'menu' }]],
      });
      return;
    }

    if (state.mode === 'orders') {
      const reply = handleOrderStatus(text);
      userState.set(chatId, {});
      await sendMessage(chatId, reply, {
        type: 'inline',
        buttons: [[{ text: '↩ Главное меню', payload: 'menu' }]],
      });
      return;
    }

    if (state.mode === 'cheese') {
      const result = await handleCheese(text);
      if (typeof result === 'string') {
        await sendMessage(chatId, result, {
          type: 'inline',
          buttons: [[{ text: '↩ Главное меню', payload: 'menu' }]],
        });
      } else {
        await sendMessage(chatId, result.loading);
        await sendMessage(chatId, result.answer, {
          type: 'inline',
          buttons: [[{ text: '↩ Главное меню', payload: 'menu' }]],
        });
      }
      return;
    }

    // Unknown input — show menu
    await sendMessage(chatId, WELCOME_TEXT, getMenuKeyboard());
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
