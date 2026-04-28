const axios = require('axios');

const ERROR_TEXT = 'Страшно, очень страшно, мы не знаем что это такое, если бы мы знали, что это такое, но мы не знаем, что это такое';

async function sendMessage(systemPrompt, userMessage) {
  try {
    const res = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 512,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data.choices[0].message.content;
  } catch (err) {
    console.error('Groq error:', err.response?.data || err.message);
    return ERROR_TEXT;
  }
}

module.exports = { sendMessage, ERROR_TEXT };
