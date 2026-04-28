const faq = require('../faq.json');
const { sendMessage } = require('../ai');

const CHEESE_SYSTEM_PROMPT = `Ты — оператор поддержки бренда "Антиосов колбасный сыр".
Отвечай коротко, дружелюбно и по делу. Продукт — качественный российский колбасный сыр,
производитель Антиосов Фудс. Если не знаешь точного ответа — извинись и предложи связаться
напрямую через antiosov.ru.`;

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
