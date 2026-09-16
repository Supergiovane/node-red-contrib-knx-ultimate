; (function (root) {
  const KNXAIChatAdapterMappings = [
    {
      id: 'windkh-telegrambot',
      title: 'windkh/node-red-contrib-telegrambot',
      inputCode: `// Receiver/Event -> Cerebrum Ultimate
// Supports normal "telegram receiver" messages, including the one-time
// reply-keyboard confirmation buttons, plus legacy callback_query events.
const telegram = msg.payload;
if (!telegram || typeof telegram !== 'object') return;

const chatId = telegram.chatId;
if (chatId === undefined || chatId === null) return;

msg.sessionId = String(chatId);
msg.language =
    (msg.originalMessage && msg.originalMessage.from && msg.originalMessage.from.language_code) ||
    msg.language ||
    '';

if (telegram.type === 'voice') {
    const original = msg.originalMessage && typeof msg.originalMessage === 'object'
        ? msg.originalMessage
        : {};
    const voice = original.voice && typeof original.voice === 'object'
        ? original.voice
        : original.message && original.message.voice && typeof original.message.voice === 'object'
            ? original.message.voice
            : {};
    const fileId = String(telegram.content || voice.file_id || '').trim();
    const weblink = String(telegram.weblink || msg.weblink || '').trim();
    const botDetails = msg.telegramBot && typeof msg.telegramBot === 'object' ? msg.telegramBot : {};
    const botApiBase = String(botDetails.baseApiUrl || botDetails.baseapiurl || botDetails.baseApiURL || '').trim();
    let allowedOrigin = 'https://api.telegram.org';
    if (botApiBase) {
        try { allowedOrigin = new URL(botApiBase).origin; } catch (error) { /* use Telegram default */ }
    }
    if (!fileId && !weblink) return;
    msg.topic = 'ask';
    msg.knxAi = Object.assign({}, msg.knxAi, {
        sessionId: String(chatId),
        voiceInput: {
            source: 'telegram',
            originalType: 'voice',
            fileId: fileId,
            weblink: weblink,
            allowedOrigin: allowedOrigin,
            mediaType: String(voice.mime_type || telegram.contentType || telegram.mimeType || 'audio/ogg'),
            filename: String(voice.file_name || telegram.filename || 'telegram-voice.ogg'),
            durationSeconds: Math.max(0, Number(voice.duration || telegram.duration) || 0),
            fileSize: Math.max(0, Number(voice.file_size || telegram.fileSize) || 0)
        }
    });
    return msg;
}

const content = typeof telegram.content === 'string' ? telegram.content.trim() : '';
if (content === '') return;

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
      outputCode: `// Cerebrum Ultimate chat output -> Telegram sender
// Converts the text reply and, when required, adds a one-time reply keyboard.
// A button click returns through the normal Telegram receiver, so no separate
// callback event node is required.
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

const audio = msg.knxAi && msg.knxAi.audio;
if (audio && Buffer.isBuffer(audio.data)) {
    const voiceLanguage = String(msg.knxAi.language || (source && source.language) || '').trim().toLowerCase().split(/[-_]/)[0];
    const disclosureLabels = {
        de: 'KI-generierte Stimme',
        en: 'AI-generated voice',
        es: 'Voz generada por IA',
        fr: 'Voix générée par l’IA',
        it: 'Voce generata dall’IA',
        zh: 'AI 生成的语音'
    };
    const disclosure = disclosureLabels[voiceLanguage] || disclosureLabels.en;
    const voiceOptions = { caption: [disclosure, content].filter(Boolean).join('\\n').slice(0, 1024) };
    const confirmation = msg.knxAi && msg.knxAi.confirmationRequest;
    if (confirmation && confirmation.required === true && Array.isArray(confirmation.actions)) {
        voiceOptions.reply_markup = JSON.stringify({
            keyboard: [confirmation.actions.map(function (action) {
                return { text: action.label };
            })],
            resize_keyboard: true,
            one_time_keyboard: true
        });
    } else if (msg.knxAi && Array.isArray(msg.knxAi.suggestions) && msg.knxAi.suggestions.length) {
        voiceOptions.reply_markup = JSON.stringify({
            keyboard: msg.knxAi.suggestions.slice(0, 3).map(function (suggestion) {
                return [{ text: Array.from(String(suggestion.text || suggestion.label || '').trim()).slice(0, 64).join('') }];
            }).filter(function (row) { return row[0].text; }),
            resize_keyboard: true,
            one_time_keyboard: true
        });
    } else if (/^knx_confirmation_/.test(String(msg.knxAi.type || '')) || /^knx_routine_/.test(String(msg.knxAi.type || ''))) {
        voiceOptions.reply_markup = JSON.stringify({ remove_keyboard: true });
    }
    msg.payload = {
        chatId: chatId,
        type: 'voice',
        content: audio.data,
        options: voiceOptions,
        fileOptions: {
            filename: audio.filename || 'knx-ai-reply.ogg',
            contentType: audio.mediaType || 'audio/ogg'
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
            keyboard: [confirmation.actions.map(function (action) {
                return { text: action.label };
            })],
            resize_keyboard: true,
            one_time_keyboard: true
        })
    };
} else if (msg.knxAi && Array.isArray(msg.knxAi.suggestions) && msg.knxAi.suggestions.length) {
    telegramPayload.options = {
        reply_markup: JSON.stringify({
            keyboard: msg.knxAi.suggestions.slice(0, 3).map(function (suggestion) {
                return [{ text: Array.from(String(suggestion.text || suggestion.label || '').trim()).slice(0, 64).join('') }];
            }).filter(function (row) { return row[0].text; }),
            resize_keyboard: true,
            one_time_keyboard: true
        })
    };
} else if (msg.knxAi && (/^knx_confirmation_/.test(String(msg.knxAi.type || '')) || /^knx_routine_/.test(String(msg.knxAi.type || '')))) {
    telegramPayload.options = {
        reply_markup: JSON.stringify({ remove_keyboard: true })
    };
}

msg.payload = telegramPayload;
return msg;`
    },
    {
      id: 'redbot-telegram',
      title: 'RedBot / node-red-contrib-chatbot (Telegram)',
      inputCode: `// RedBot Telegram Receiver -> Cerebrum Ultimate
// RedBot normalizes Telegram text, voice audio and inline-button postbacks in msg.payload.
const redbot = msg.payload;
if (!redbot || typeof redbot !== 'object') return;
if (redbot.transport && redbot.transport !== 'telegram') return;

const chatId = redbot.chatId;
if (chatId === undefined || chatId === null) return;

msg.sessionId = String(chatId);
msg.language =
    (msg.originalMessage && msg.originalMessage.from && msg.originalMessage.from.language_code) ||
    redbot.language ||
    msg.language ||
    '';

const redbotType = String(redbot.type || '').trim().toLowerCase();
if ((redbotType === 'audio' || redbotType === 'voice') && Buffer.isBuffer(redbot.content)) {
    const original = msg.originalMessage && typeof msg.originalMessage === 'object'
        ? msg.originalMessage
        : {};
    const voice = original.voice && typeof original.voice === 'object'
        ? original.voice
        : original.message && original.message.voice && typeof original.message.voice === 'object'
            ? original.message.voice
            : {};
    msg.topic = 'ask';
    msg.knxAi = Object.assign({}, msg.knxAi, {
        sessionId: String(chatId),
        voiceInput: {
            source: 'telegram',
            originalType: 'voice',
            transport: 'redbot-buffer',
            data: redbot.content,
            fileId: String(voice.file_id || '').trim(),
            mediaType: String(voice.mime_type || redbot.mimeType || 'audio/ogg'),
            filename: String(voice.file_name || redbot.filename || 'telegram-voice.ogg'),
            durationSeconds: Math.max(0, Number(voice.duration || redbot.duration) || 0),
            fileSize: Math.max(0, Number(voice.file_size || redbot.fileSize) || redbot.content.length)
        }
    });
    return msg;
}

const content = typeof redbot.content === 'string' ? redbot.content.trim() : '';
if (redbotType !== 'message' || content === '') return;

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
      outputCode: `// Cerebrum Ultimate chat output -> RedBot Telegram Sender
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
    const contextValues = {
        chatId: chatId,
        userId: sourcePayload.userId,
        transport: sourcePayload.transport || 'telegram'
    };
    const syntheticContext = {
        get: function () {
            const keys = Array.prototype.slice.call(arguments);
            if (keys.length === 0) return Object.assign({}, contextValues);
            if (keys.length === 1) return contextValues[keys[0]];
            return keys.reduce(function (result, key) {
                result[key] = contextValues[key];
                return result;
            }, {});
        },
        set: function (key, value) {
            if (key && typeof key === 'object') Object.assign(contextValues, key);
            else if (key !== undefined) contextValues[key] = value;
            return syntheticContext;
        },
        remove: function () {
            Array.prototype.slice.call(arguments).forEach(function (key) { delete contextValues[key]; });
            return syntheticContext;
        },
        clear: function () {
            Object.keys(contextValues).forEach(function (key) { delete contextValues[key]; });
            return syntheticContext;
        },
        all: function () { return Object.assign({}, contextValues); }
    };
    msg.chat = function () {
        return syntheticContext;
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

const confirmation = msg.knxAi && msg.knxAi.confirmationRequest;
const audio = msg.knxAi && msg.knxAi.audio;
if (audio && Buffer.isBuffer(audio.data) && !(confirmation && confirmation.required === true)) {
    const voiceLanguage = String(msg.knxAi.language || (source && source.language) || '').trim().toLowerCase().split(/[-_]/)[0];
    const disclosureLabels = {
        de: 'KI-generierte Stimme',
        en: 'AI-generated voice',
        es: 'Voz generada por IA',
        fr: 'Voix générée par l’IA',
        it: 'Voce generata dall’IA',
        zh: 'AI 生成的语音'
    };
    const disclosure = disclosureLabels[voiceLanguage] || disclosureLabels.en;
    msg.payload = {
        transport: sourcePayload.transport || 'telegram',
        chatId: chatId,
        type: 'audio',
        inbound: false,
        content: audio.data,
        filename: audio.filename || 'knx-ai-reply.ogg',
        mimeType: audio.mediaType || 'audio/ogg',
        caption: [disclosure, content].filter(Boolean).join('\\n').slice(0, 1024)
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
