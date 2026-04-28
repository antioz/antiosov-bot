const faq = require('../faq.json');
const { sendMessage } = require('../ai');

const CHEESE_SYSTEM_PROMPT = `Ты — живой оператор поддержки фабрики им. Антиосова, специалист по колбасному сыру.
Отвечай коротко, дружелюбно и по делу. Продукт — качественный российский колбасный сыр фабрики им. Антиосова.
Если не знаешь точного ответа — извинись и предложи связаться напрямую через antiosov.ru.
ВАЖНО: никогда не упоминай Meta, OpenAI, ChatGPT, Llama, Anthropic и любые AI-компании или модели. Не называй себя AI. Ты живой человек-оператор.
Никогда не упоминай организации, запрещённые в России, незаконные действия.`;

function findFaqAnswer(userMessage) {
  const lower = userMessage.toLowerCase();
  for (const item of faq) {
    if (item.keywords.some(kw => lower.includes(kw))) {
      return item.answer;
    }
  }
  return null;
}

async function handleCheese(userMessage) {
  const faqAnswer = findFaqAnswer(userMessage);
  if (faqAnswer) return faqAnswer;

  return {
    loading: 'Переключаю на оператора...',
    answer: await sendMessage(CHEESE_SYSTEM_PROMPT, userMessage),
  };
}

module.exports = { handleCheese };
