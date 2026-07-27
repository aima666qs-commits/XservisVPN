import 'dotenv/config';
import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { Telegraf, Markup } from 'telegraf';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 443;
const HTTP_PORT = process.env.HTTP_PORT || 80;
const DOMAIN = process.env.DOMAIN || 'xservisvpn.ru';
const BOT_TOKEN = process.env.BOT_TOKEN || '8140147139:AAFV2IAQxkPCpLCkqPG7D5RKS6K6t2w6M2s';

const app = express();

// ====== PRODUCTION MIDDLEWARE ======
app.use(compression());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(cors({
  origin: [`https://${DOMAIN}`, `http://${DOMAIN}`, 'https://aima666qs-commits.github.io'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' },
});
app.use('/api/', limiter);

// ====== SERVE STATIC (built React app) ======
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath, {
  maxAge: '7d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  },
}));

// ====== API ======
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.0.0', uptime: process.uptime(), domain: DOMAIN });
});

app.get('/api/config/:type', (req, res) => {
  const configs = {
    'vless-reality': { protocol: 'vless', address: '148.135.211.19', port: 443, id: 'a06b7132-43bb-41f0-b751-9a1b071959af', flow: 'xtls-rprx-vision', security: 'reality', sni: 'www.cloudflare.com' },
    'hysteria2': { protocol: 'hysteria2', address: 'srv-17e124.21freedom.net', port: 11592, auth: '4f90e77a5a' },
  };
  res.json(configs[req.params.type] || configs['vless-reality']);
});

// ====== TELEGRAM BOT ======
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  const name = ctx.from.first_name || 'друг';
  ctx.replyWithHTML(`
<b>🚀 XservisVPN — AI-роутинг нового поколения</b>

Привет, ${name}! 👋

🌐 <b>Нажми кнопку ниже</b> — VPN подключится сам
🤖 AI выберет сервер, SNI и порт под тебя
📱 WhatsApp, YouTube, Telegram, Instagram — работают всегда

<b>Просто подключись 👇</b>
  `, Markup.inlineKeyboard([
    [Markup.button.webApp('🌐 Запустить XservisVPN', `https://${DOMAIN}`)],
    [Markup.button.callback('🔗 Конфиги', 'get_config'), Markup.button.callback('📱 iOS', 'ios_guide')],
    [Markup.button.callback('🤖 Android', 'android_guide'), Markup.button.callback('❓ Помощь', 'help')],
  ]));
});

bot.command('config', async (ctx) => {
  await ctx.replyWithHTML(`
<b>🔗 Выбери конфиг:</b>

🇫🇮 <b>fi-main</b> — 148.135.211.19:443 (VLESS Reality)
🇷🇺 <b>RU 40443</b> — 77.91.93.217:40443 (VLESS Reality)
🇷🇺 <b>Hysteria YouTube</b> — srv-17e124.21freedom.net:11592
🇸🇪 <b>gRPC Megafon</b> — 84.201.154.210:443
  `, Markup.inlineKeyboard([
    [Markup.button.webApp('🌐 Открыть в приложении', `https://${DOMAIN}`)],
  ]));
});

bot.command('help', async (ctx) => {
  await ctx.replyWithHTML(`
<b>❓ XservisVPN — Помощь</b>

<b>Команды:</b>
/start — Главное меню
/config — Конфиги
/help — Помощь

<b>Протоколы:</b>
VLESS Reality, Hysteria 2, gRPC, VLESS TCP

<b>Приоритет:</b>
WhatsApp, YouTube, Telegram, Instagram

<b>Сайт:</b> <a href='https://${DOMAIN}'>${DOMAIN}</a>
<b>Бот:</b> @Xserv1sbot
  `);
});

bot.on('text', async (ctx) => {
  const t = ctx.message.text.toLowerCase();
  if (t.includes('конфиг') || t.includes('config') || t.includes('ключ')) {
    await ctx.reply('🔗 Нажми /config');
  } else {
    await ctx.replyWithHTML(`Привет! Нажми /start или открой <a href='https://${DOMAIN}'>${DOMAIN}</a>`);
  }
});

bot.launch().then(() => console.log('🤖 Bot ready')).catch(console.error);

// ====== SPA FALLBACK ======
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// ====== START ======
app.listen(PORT, () => {
  console.log(`🌐 XservisVPN server running on port ${PORT}`);
  console.log(`🔗 https://${DOMAIN}`);
  console.log(`🤖 Bot: @Xserv1sbot`);
});

// Also listen on HTTP for redirect
if (HTTP_PORT && HTTP_PORT !== PORT) {
  const httpApp = express();
  httpApp.get('*', (req, res) => {
    res.redirect(301, `https://${DOMAIN}${req.url}`);
  });
  httpApp.listen(HTTP_PORT, () => {
    console.log(`↪️ HTTP redirect on port ${HTTP_PORT} → https://${DOMAIN}`);
  });
}

// Graceful shutdown
process.on('SIGINT', () => { bot.stop(); process.exit(0); });
process.on('SIGTERM', () => { bot.stop(); process.exit(0); });
