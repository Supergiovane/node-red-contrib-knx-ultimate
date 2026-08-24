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

const image = msg.knxAi && msg.knxAi.image;
if (image && Buffer.isBuffer(image.data)) {
    msg.payload = {
        chatId: chatId,
        type: 'photo',
        content: image.data,
        options: {
            caption: content.slice(0, 1024)
        },
        fileOptions: {
            filename: image.filename || 'camera-snapshot.jpg',
            contentType: image.mediaType || 'image/jpeg'
        }
    };
    return msg;
}

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
    },
    {
      id: 'redbot-telegram',
      title: 'RedBot / node-red-contrib-chatbot (Telegram)',
      inputCode: `// RedBot Telegram Receiver -> KNX AI
// RedBot normalizes Telegram text and inline-button postbacks in msg.payload.
const redbot = msg.payload;
if (!redbot || typeof redbot !== 'object') return;
if (redbot.transport && redbot.transport !== 'telegram') return;

const chatId = redbot.chatId;
const content = typeof redbot.content === 'string' ? redbot.content.trim() : '';
if (chatId === undefined || chatId === null || content === '') return;
if (redbot.type !== 'message') return;

msg.sessionId = String(chatId);
msg.language =
    (msg.originalMessage && msg.originalMessage.from && msg.originalMessage.from.language_code) ||
    redbot.language ||
    msg.language ||
    '';

const action = content.toLowerCase();
if (action === 'confirm' || action === 'cancel') {
    msg.topic = action;
    msg.knxAi = Object.assign({}, msg.knxAi, {
        sessionId: String(chatId),
        confirm: action === 'confirm'
    });
    return msg;
}

msg.topic = 'ask';
msg.prompt = content;
return msg;`,
      outputCode: `// KNX AI chat output -> RedBot Telegram Sender
// Preserves RedBot conversation helpers and emits either a plain message
// or inline postback buttons for KNX confirmation/cancellation.
const source = msg.inputMessage && typeof msg.inputMessage === 'object'
    ? msg.inputMessage
    : inputMessage;
const sourcePayload = source && source.payload && typeof source.payload === 'object'
    ? source.payload
    : {};
const originalMessage = source && source.originalMessage && typeof source.originalMessage === 'object'
    ? source.originalMessage
    : {};
const chatId = sourcePayload.chatId !== undefined
    ? sourcePayload.chatId
    : originalMessage.chat && originalMessage.chat.id;
if (chatId === undefined || chatId === null) return;

// RedBot's Sender uses these helpers to resolve the active bot and chat context.
['originalMessage', 'chat', 'api', 'client', 'redBot'].forEach(function (key) {
    if (msg[key] === undefined && source && source[key] !== undefined) {
        msg[key] = source[key];
    }
});

// A persisted camera watch can fire immediately after Node-RED restarts,
// before a new inbound RedBot message has recreated its conversation helpers.
// RedBot's Telegram Sender still needs transport metadata and a chat accessor,
// even when tracking is disabled. Supply the smallest compatible outbound
// envelope; the configured Sender remains responsible for choosing the bot.
if (!msg.originalMessage || typeof msg.originalMessage !== 'object') {
    msg.originalMessage = {};
}
if (!msg.originalMessage.transport) msg.originalMessage.transport = sourcePayload.transport || 'telegram';
if (msg.originalMessage.chatId === undefined) msg.originalMessage.chatId = chatId;
if (sourcePayload.userId !== undefined && msg.originalMessage.userId === undefined) {
    msg.originalMessage.userId = sourcePayload.userId;
}
if (typeof msg.chat !== 'function') {
    msg.chat = function () {
        return {
            get: function () { return {}; },
            set: function () { return undefined; },
            remove: function () { return undefined; }
        };
    };
}
if (typeof msg.get !== 'function') {
    msg.get = function (key) {
        if (key === 'userId') return sourcePayload.userId;
        if (key === 'chatId') return chatId;
        if (key === 'transport') return sourcePayload.transport || 'telegram';
        return undefined;
    };
}

let content = msg.payload;
if (content && typeof content === 'object') {
    content = content.error || content.message || JSON.stringify(content);
}
content = String(content === undefined || content === null ? '' : content);

const image = msg.knxAi && msg.knxAi.image;
if (image && Buffer.isBuffer(image.data)) {
    msg.payload = {
        transport: sourcePayload.transport || 'telegram',
        chatId: chatId,
        type: 'photo',
        inbound: false,
        content: image.data,
        filename: image.filename || 'camera-snapshot.jpg',
        mimeType: image.mediaType || 'image/jpeg',
        caption: content.slice(0, 1024)
    };
    if (sourcePayload.userId !== undefined) msg.payload.userId = sourcePayload.userId;
    return msg;
}

const redbotPayload = {
    transport: sourcePayload.transport || 'telegram',
    chatId: chatId,
    type: 'message',
    inbound: false,
    content: content
};
if (sourcePayload.userId !== undefined) redbotPayload.userId = sourcePayload.userId;

const confirmation = msg.knxAi && msg.knxAi.confirmationRequest;
if (confirmation && confirmation.required === true && Array.isArray(confirmation.actions)) {
    redbotPayload.type = 'inline-buttons';
    redbotPayload.buttons = confirmation.actions.map(function (action) {
        return {
            type: 'postback',
            label: action.label,
            value: action.callbackData
        };
    });
}

msg.payload = redbotPayload;
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
