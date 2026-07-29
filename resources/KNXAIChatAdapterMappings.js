; (function (root) {
  const KNXAIChatAdapterMappings = [
    {
      id: 'windkh-telegrambot',
      title: 'windkh/node-red-contrib-telegrambot',
      inputCode: `// Receiver/Event -> KNX AI
// Supports "telegram receiver" text messages and "telegram event"
// callback_query messages produced by inline confirmation buttons.
const telegram = msg.payload;
if (!telegram || typeof telegram !== 'object') return;

const chatId = telegram.chatId;
const content = typeof telegram.content === 'string' ? telegram.content.trim() : '';
if (chatId === undefined || chatId === null || content === '') return;

msg.sessionId = String(chatId);
msg.language =
    (msg.originalMessage && msg.originalMessage.from && msg.originalMessage.from.language_code) ||
    msg.language ||
    '';

if (telegram.type === 'callback_query' && (content === 'confirm' || content === 'cancel')) {
    msg.topic = content;
    msg.knxAi = Object.assign({}, msg.knxAi, {
        sessionId: String(chatId),
        confirm: content === 'confirm'
    });
    return msg;
}

if (telegram.type !== 'message') return;
msg.topic = 'ask';
msg.prompt = content;
return msg;`,
      outputCode: `// KNX AI chat output -> Telegram sender
// Converts the text reply and, when required, adds inline
// confirmation/cancellation buttons.
const source = msg.inputMessage && typeof msg.inputMessage === 'object'
    ? msg.inputMessage
    : inputMessage;
const sourcePayload = source && source.payload && typeof source.payload === 'object'
    ? source.payload
    : {};
const chatId = sourcePayload.chatId !== undefined
    ? sourcePayload.chatId
    : source && source.chatId;
if (chatId === undefined || chatId === null) return;

let content = msg.payload;
if (content && typeof content === 'object') {
    content = content.error || content.message || JSON.stringify(content);
}
content = String(content === undefined || content === null ? '' : content);

const telegramPayload = {
    chatId: chatId,
    type: 'message',
    content: content
};
const confirmation = msg.knxAi && msg.knxAi.confirmationRequest;
if (confirmation && confirmation.required === true && Array.isArray(confirmation.actions)) {
    telegramPayload.options = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                confirmation.actions.map(function (action) {
                    return {
                        text: action.label,
                        callback_data: action.callbackData
                    };
                })
            ]
        })
    };
}

msg.payload = telegramPayload;
return msg;`
    }
  ]

  if (root) {
    root.KNXAIChatAdapterMappings = KNXAIChatAdapterMappings
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNXAIChatAdapterMappings
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this))
