const EMOJIS = [
  '🧀','🎲','🎭','🌊','🔥','💡','🎯','🚀','🌈','⚡',
  '🎪','🦊','🐙','🌵','🍄','🎸','🦋','🌺','🧩','🎨',
  '🐳','🦜','🍕','🎠','🌙','⭐','🎻','🦁','🌻','🎡'
];

function getRandomEmoji() {
  return EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

module.exports = { getRandomEmoji };
