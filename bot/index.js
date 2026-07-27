import 'dotenv/config';
import express from 'express';
import { Telegraf, Markup } from 'telegraf';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TOKEN = '8690746870:AAEFWCGBM59QT48UxqrEixyMECg4v4oiQiI';
const PORT = process.env.PORT || 3000;
const APP_URL = process.env.APP_URL || `https://aima666qs-commits.github.io/XservisVPN`;

const bot = new Telegraf(TOKEN);
const app = express();

app.use(cors());
app.use(express.json());

// Serve static frontend
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));

// API endpoint for configs
app.get('/api/config/:type', (req, res) => {
  const { type } = req.params;
  const configs = {
    'vless-reality': {
      protocol: 'vless',
      address: '148.135.211.19',
      port: 443,
      id: 'a06b7132-43bb-41f0-b751-9a1b071959af',
      flow: 'xtls-rprx-vision',
      security: 'reality',
      sni: 'www.cloudflare.com',
    },
    'hysteria2': {
      protocol: 'hysteria2',
      address: 'srv-17e124.21freedom.net',
      port: 11592,
      auth: '4f90e77a5a',
      sni: 'srv-17e124.21freedom.net',
    },
  };
  res.json(configs[type] || configs['vless-reality']);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0', uptime: process.uptime() });
});

// ====== TELEGRAM BOT ======

// Start command
bot.start((ctx) => {
  const name = ctx.from.first_name || 'друг';
  ctx.replyWithHTML(`
<b>🚀 XservisVPN — AI-роутинг нового поколения</b>

Привет, ${name}! 👋

Я — AI-помощник XservisVPN. Я помогу тебе:
• 🔗 Получить конфиг для подключения
• 🌍 Выбрать лучший сервер
• 📱 Настроить VPN на iOS/Android
• 🆘 Ответить на вопросы

<b>Просто нажми кнопку ниже 👇</b>
  `, Markup.inlineKeyboard([
    [Markup.button.webApp('🌐 Открыть XservisVPN', APP_URL)],
    [Markup.button.callback('🔗 Получить конфиг', 'get_config'),
     Markup.button.callback('🌍 Серверы', 'servers')],
    [Markup.button.callback('📱 iOS инструкция', 'ios_guide'),
     Markup.button.callback('🤖 Android инструкция', 'android_guide')],
    [Markup.button.callback('❓ Помощь', 'help')],
  ]));
});

// Config command
bot.command('config', async (ctx) => {
  await sendConfigMenu(ctx);
});

bot.action('get_config', async (ctx) => {
  await ctx.answerCbQuery();
  await sendConfigMenu(ctx);
});

async function sendConfigMenu(ctx) {
  await ctx.replyWithHTML(`
<b>🔗 Выбери тип конфига:</b>

${getConfigList()}
  `, Markup.inlineKeyboard([
    [Markup.button.callback('🇫🇮 fi-main (VLESS Reality)', 'cfg_fi'),
     Markup.button.callback('🇷🇺 RU 40443', 'cfg_ru')],
    [Markup.button.callback('🇷🇺 Hysteria 2 (YouTube)', 'cfg_hy1'),
     Markup.button.callback('🇷🇺 Hysteria 2 (РФ)', 'cfg_hy2')],
    [Markup.button.callback('🇸🇪 gRPC (Megafon)', 'cfg_grpc1'),
     Markup.button.callback('🇩🇪 gRPC (LTE)', 'cfg_grpc2')],
    [Markup.button.callback('🔙 Назад', 'back_main')],
  ]));
}

function getConfigList() {
  return `
🇫🇮 <b>fi-main</b> — VLESS Reality
   IP: 148.135.211.19:443
   SNI: www.cloudflare.com

🇷🇺 <b>RU 40443</b> — VLESS Reality
   IP: 77.91.93.217:40443
   SNI: www.cloudflare.com

🇷🇺 <b>Hysteria YouTube</b> — Hysteria 2
   IP: srv-17e124.21freedom.net:11592
   SNI: srv-17e124.21freedom.net

🇸🇪 <b>gRPC Megafon</b>
   IP: 84.201.154.210:443
   SNI: ads.x5.ru
  `;
}

// Config actions
const configActions = {
  cfg_fi: {
    name: '🇫🇮 fi-main',
    link: 'vless://a06b7132-43bb-41f0-b751-9a1b071959af@148.135.211.19:443?type=tcp&security=reality&pbk=bJugVmxSK8GtMzxwrMJ1fO7Q1i-Ati0Px2SI80KgdAI&sid=b24ad2fc6edce831&s=www.cloudflare.com&fp=chrome&flow=xtls-rprx-vision&sni=www.cloudflare.com#🇫🇮 fi-main',
    protocol: 'VLESS Reality',
  },
  cfg_ru: {
    name: '🇷🇺 RU 40443',
    link: 'vless://270472e6-95d6-46d1-a92b-c23410fa4dfa@77.91.93.217:40443?type=tcp&security=reality&pbk=F5ubDFZU1s3UYQK_5x-2AazV8ECv9FmvjOFXnsOXz0w&sid=d51143136a97b0e8&s=www.cloudflare.com&fp=chrome&flow=xtls-rprx-vision&sni=www.cloudflare.com#🇷🇺 RU 40443',
    protocol: 'VLESS Reality',
  },
  cfg_hy1: {
    name: '🇷🇺 Hysteria YouTube',
    link: 'hysteria2://4f90e77a5a@srv-17e124.21freedom.net:11592?alpn=h3&insecure=0#🇷🇺 РФ YouTube',
    protocol: 'Hysteria 2',
  },
  cfg_hy2: {
    name: '🇷🇺 Hysteria РФ',
    link: 'hysteria2://374719a289@srv-0dc9de.21freedom.net:11592?alpn=h3&insecure=0#🇷🇺 Hysteria 2',
    protocol: 'Hysteria 2',
  },
  cfg_grpc1: {
    name: '🇸🇪 gRPC Megafon',
    link: 'vless://b8a8be72-6a1d-4748-b59a-f19c81335cd1@84.201.154.210:443?type=grpc&security=reality&serviceName=EventStreamService&pbk=7M74I50v50xdqLbSKZgcb_NtxP-owuiUNDjFJeHR8Rk&sid=dcce1059e118666e&s=ads.x5.ru&fp=chrome&sni=ads.x5.ru#🇸🇪 gRPC Megafon',
    protocol: 'gRPC',
  },
  cfg_grpc2: {
    name: '🇩🇪 gRPC LTE',
    link: 'vless://b8a8be72-6a1d-4748-b59a-f19c81335cd1@91.240.87.0:443?type=grpc&security=reality&serviceName=EventStreamService&pbk=jCbf1tqO8HAF9Qdr_67cEcCBHwV4lu5u2jhZZpLE3lo&sid=ffbe35a334761d49&s=ads.x5.ru&fp=chrome&sni=ads.x5.ru#🇩🇪 gRPC LTE',
    protocol: 'gRPC',
  },
};

Object.entries(configActions).forEach(([key, cfg]) => {
  bot.action(key, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(`
<b>${cfg.name}</b>
📡 Протокол: <b>${cfg.protocol}</b>

<b>🔗 Ссылка для подключения:</b>
<code>${cfg.link}</code>

<i>Нажми на ссылку, чтобы скопировать</i>
    `, Markup.inlineKeyboard([
      [Markup.button.callback('📋 Копировать', `copy_${key}`)],
      [Markup.button.webApp('🌐 Открыть в XservisVPN', APP_URL)],
      [Markup.button.callback('🔙 Назад к конфигам', 'get_config')],
    ]));
  });
});

// Copy handler — sends the link alone for easy copying
Object.entries(configActions).forEach(([key, cfg]) => {
  bot.action(`copy_${key}`, async (ctx) => {
    await ctx.answerCbQuery('✅ Конфиг скопирован!');
    await ctx.reply(cfg.link);
  });
});

// Servers
bot.action('servers', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(`
<b>🌍 Доступные серверы:</b>

${getConfigList()}

<i>AI автоматически выберет лучший сервер под твоего провайдера.</i>
  `, Markup.inlineKeyboard([
    [Markup.button.webApp('🌐 Открыть карту серверов', APP_URL)],
    [Markup.button.callback('🔙 Назад', 'back_main')],
  ]));
});

// iOS guide
bot.action('ios_guide', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(`
<b>📱 iOS инструкция</b>

<b>Вариант 1: v2rayTun</b>
1. Скачай <a href="https://apps.apple.com/app/v2raytun/id6476628951">v2rayTun</a> из App Store
2. Открой XservisVPN → нажми «📲 Скачать / Вставить в приложение»
3. Выбери iOS — конфиг вставится автоматически

<b>Вариант 2: Shadowrocket</b>
1. Скачай Shadowrocket из App Store
2. Скопируй VLESS ссылку из бота
3. Открой Shadowrocket → вставь ссылку

<b>Вариант 3: Stash / Sing-box</b>
1. Скачай приложение
2. Скопируй JSON конфиг
3. Импортируй в приложение
  `, Markup.inlineKeyboard([
    [Markup.button.url('📲 v2rayTun', 'https://apps.apple.com/app/v2raytun/id6476628951')],
    [Markup.button.webApp('🌐 XservisVPN', APP_URL)],
    [Markup.button.callback('🔙 Назад', 'back_main')],
  ]));
});

// Android guide
bot.action('android_guide', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(`
<b>🤖 Android инструкция</b>

<b>Вариант 1: v2rayNG</b>
1. Скачай <a href="https://play.google.com/store/apps/details?id=com.v2ray.ang">v2rayNG</a> из Play Market
2. Открой XservisVPN → нажми «📲 Скачать / Вставить в приложение»
3. Выбери Android — конфиг вставится автоматически

<b>Вариант 2: NekoBox</b>
1. Скачай NekoBox
2. Скопируй VLESS/Hysteria2 ссылку
3. Импортируй через буфер обмена

<b>Вариант 3: Hiddify / Sing-box</b>
1. Скачай приложение
2. Скопируй ссылку подписки
3. Вставь в приложение
  `, Markup.inlineKeyboard([
    [Markup.button.url('📲 v2rayNG', 'https://play.google.com/store/apps/details?id=com.v2ray.ang')],
    [Markup.button.webApp('🌐 XservisVPN', APP_URL)],
    [Markup.button.callback('🔙 Назад', 'back_main')],
  ]));
});

// Help
bot.command('help', async (ctx) => {
  await ctx.replyWithHTML(`
<b>❓ Помощь по XservisVPN</b>

<b>Что такое XservisVPN?</b>
VPN-сервис с AI-роутингом. Автоматически подбирает сервер, SNI, порт и протокол под твоего провайдера.

<b>Команды бота:</b>
/start — Главное меню
/config — Получить конфиг
/servers — Список серверов
/ios — Инструкция для iOS
/android — Инструкция для Android
/help — Эта справка

<b>Поддерживаемые протоколы:</b>
• VLESS Reality — самый стабильный
• Hysteria 2 — высокая скорость
• gRPC — обход блокировок

<b>Приоритет трафика:</b>
WhatsApp, YouTube, Telegram, Instagram

<b>Автоматическая ротация:</b>
SNI, порты, серверы — каждые 15 секунд

<i>По всем вопросам: @xservis_support</i>
  `, Markup.inlineKeyboard([
    [Markup.button.webApp('🌐 Открыть XservisVPN', APP_URL)],
  ]));
});

bot.action('help', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(`
<b>❓ Помощь</b>

<b>Поддерживаемые протоколы:</b>
• VLESS Reality
• Hysteria 2
• gRPC
• VLESS TCP

<b>Приоритет:</b>
WhatsApp, YouTube, Telegram, Instagram

<i>@xservis_support</i>
  `);
});

bot.action('back_main', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithHTML(`
<b>🚀 XservisVPN — AI-роутинг</b>

Чем могу помочь?
  `, Markup.inlineKeyboard([
    [Markup.button.webApp('🌐 Открыть XservisVPN', APP_URL)],
    [Markup.button.callback('🔗 Конфиг', 'get_config'),
     Markup.button.callback('🌍 Серверы', 'servers')],
    [Markup.button.callback('📱 iOS', 'ios_guide'),
     Markup.button.callback('🤖 Android', 'android_guide')],
    [Markup.button.callback('❓ Помощь', 'help')],
  ]));
});

// Generic commands
bot.command('ios', async (ctx) => {
  await ctx.replyWithHTML(`
<b>📱 iOS приложения для VPN:</b>

1. <a href="https://apps.apple.com/app/v2raytun/id6476628951">v2rayTun</a> — рекомендую
2. Shadowrocket
3. Stash
4. Sing-box
5. Quantumult X

Открой XservisVPN → нажми «Скачать / Вставить» → выбери iOS
  `, Markup.inlineKeyboard([
    [Markup.button.url('📲 v2rayTun', 'https://apps.apple.com/app/v2raytun/id6476628951')],
    [Markup.button.webApp('🌐 XservisVPN', APP_URL)],
  ]));
});

bot.command('android', async (ctx) => {
  await ctx.replyWithHTML(`
<b>🤖 Android приложения для VPN:</b>

1. <a href="https://play.google.com/store/apps/details?id=com.v2ray.ang">v2rayNG</a> — рекомендую
2. NekoBox
3. Hiddify
4. Sing-box
5. v2rayNG Plus

Открой XservisVPN → нажми «Скачать / Вставить» → выбери Android
  `, Markup.inlineKeyboard([
    [Markup.button.url('📲 v2rayNG', 'https://play.google.com/store/apps/details?id=com.v2ray.ang')],
    [Markup.button.webApp('🌐 XservisVPN', APP_URL)],
  ]));
});

bot.command('servers', async (ctx) => {
  await ctx.replyWithHTML(`
<b>🌍 Все серверы XservisVPN:</b>
${getConfigList()}
  `, Markup.inlineKeyboard([
    [Markup.button.webApp('🌐 Выбрать в приложении', APP_URL)],
  ]));
});

// Catch-all
bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  if (text.includes('конфиг') || text.includes('config') || text.includes('ключ')) {
    await sendConfigMenu(ctx);
  } else if (text.includes('ios') || text.includes('айфон') || text.includes('iphone')) {
    await ctx.replyWithHTML('📱 Инструкция для iOS — нажми /ios');
  } else if (text.includes('android') || text.includes('андроид')) {
    await ctx.replyWithHTML('🤖 Инструкция для Android — нажми /android');
  } else if (text.includes('сервер') || text.includes('server')) {
    await ctx.replyWithHTML('🌍 Список серверов — нажми /servers');
  } else if (text.includes('помощ') || text.includes('help')) {
    await ctx.replyWithHTML('❓ Помощь — нажми /help');
  } else {
    await ctx.replyWithHTML(`
Привет! 👋

Я XservisVPN бот. Вот что я умею:

/start — Главное меню
/config — Получить конфиг
/servers — Серверы
/ios — iOS инструкция
/android — Android инструкция
/help — Помощь
    `);
  }
});

// Start bot
bot.launch().then(() => {
  console.log('🤖 XservisVPN Bot is running!');
}).catch(err => {
  console.error('Bot launch error:', err);
});

// Express server
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 XservisVPN server running on port ${PORT}`);
  console.log(`📱 Web App: http://localhost:${PORT}`);
  console.log(`🤖 Bot: @XservisVPN_bot`);
});

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
