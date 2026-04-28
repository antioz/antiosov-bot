const axios = require('axios');

const ERROR_TEXT = 'Страшно, очень страшно, мы не знаем что это такое, если бы мы знали, что это такое, но мы не знаем, что это такое';

let cachedToken = null;
let tokenExpiresAt = 0;

async function getGigaChatToken() {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const credentials = Buffer.from(
    `${process.env.GIGACHAT_CLIENT_ID}:${process.env.GIGACHAT_CLIENT_SECRET}`
  ).toString('base64');

  const res = await axios.post(
    'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
    'scope=GIGACHAT_API_PERS',
    {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'RqUID': crypto.randomUUID(),
      },
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    }
  );

  cachedToken = res.data.access_token;
  tokenExpiresAt = Date.now() + (res.data.expires_at - 60) * 1000;
  return cachedToken;
}

async function sendMessage(systemPrompt, userMessage) {
  try {
    const token = await getGigaChatToken();
    const res = await axios.post(
      'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
      {
        model: 'GigaChat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
      }
    );
    return res.data.choices[0].message.content;
  } catch (err) {
    console.error('GigaChat error:', err.message);
    return ERROR_TEXT;
  }
}

module.exports = { sendMessage, ERROR_TEXT };
