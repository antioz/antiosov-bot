const { sendMessage } = require('../ai');

const TONES = {
  official: {
    label: 'Официальный',
    prompt: 'Ты — вежливый профессиональный оператор поддержки. Отвечай формально, структурировано, без сленга. Используй обращение "Вы".',
  },
  friendly: {
    label: 'Дружелюбный',
    prompt: 'Ты — дружелюбный помощник поддержки. Отвечай тепло, с заботой, можешь использовать эмодзи. Обращайся на "ты".',
  },
  bold: {
    label: 'Дерзкий',
    prompt: 'Ты — дерзкий, уверенный оператор. Отвечай прямо, без лишних слов, с юмором и характером. Можешь иронизировать, но помогай по делу.',
  },
};

function getToneButtons() {
  return Object.entries(TONES).map(([key, t]) => ({ type: 'callback', text: t.label, payload: `tone_${key}` }));
}

function getTonePrompt(toneKey) {
  return TONES[toneKey]?.prompt || TONES.friendly.prompt;
}

async function handleSupport(systemPrompt, userMessage) {
  return await sendMessage(systemPrompt, userMessage);
}

module.exports = { getToneButtons, getTonePrompt, handleSupport };
