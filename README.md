# 🚀 XservisVPN — AI-роутинг нового поколения

> **VPN, который подбирается под тебя.** AI автоматически выбирает сервер, SNI, порт и протокол под твоего провайдера и регион.

---

## 📱 Telegram Bot

**Бот:** [@XservisVPN_bot](https://t.me/XservisVPN_bot) (работает прямо сейчас!)

**Команды:**
| Команда | Описание |
|---------|----------|
| `/start` | Главное меню |
| `/config` | Получить конфиг для подключения |
| `/servers` | Список всех серверов |
| `/ios` | Инструкция для iOS |
| `/android` | Инструкция для Android |
| `/help` | Помощь |

---

## 🌐 Веб-приложение

**Сайт:** [aima666qs-commits.github.io/XservisVPN](https://aima666qs-commits.github.io/XservisVPN)

**Стек:** React 19 + TypeScript + Tailwind CSS 3 + Framer Motion + Vite

### 🎨 12 премиальных тем:
| Тема | Цвета |
|------|-------|
| 🌊 Ocean Cyan | Бирюзово-голубой градиент |
| 🧊 Arctic Blue | Холодный синий |
| 💚 Emerald | Изумрудный |
| 🟣 Purple Night | Фиолетовый |
| 🌸 Sakura | Розовый |
| 🟢 Cyber Neon | Неоновый киберпанк |
| 🌙 Midnight | Тёмный минимализм |
| 💚 Matrix Green | Зелёный неон |
| 🌅 Sunset | Оранжевый закат |
| 🥇 Royal Gold | Золотой |
| 🔴 Crimson | Красный |
| ⚫ Pure Black | Абсолютно чёрный |

### 📡 Протоколы:
- **VLESS Reality** — самый стабильный, 3 сервера (🇫🇮🇷🇺)
- **Hysteria 2** — высокая скорость, 3 сервера (🇷🇺)
- **gRPC** — обход блокировок, 2 сервера (🇸🇪🇩🇪)
- **VLESS TCP** — универсальный

### 🔄 Автоматическая ротация:
- SNI (15 доменов) — Google, Cloudflare, Microsoft, Apple...
- Порты — 443, 8443, 2096, 2087, 2053...
- Серверы — AI выбирает лучший
- Fingerprint — Chrome/Firefox/Safari/Edge/Random

### 🎭 Реальный подлог:
- Маскировка под легитимные сайты
- Индивидуальный TLS fingerprint
- Smart Rotation без разрыва соединения

---

## 📲 Установка

### iOS
1. Скачай [v2rayTun](https://apps.apple.com/app/v2raytun/id6476628951) из App Store
2. Открой веб-приложение → кнопка **«Скачать / Вставить в приложение»**
3. Выбери iOS — конфиг скопируется и откроется в v2rayTun автоматически

**Альтернативы:** Shadowrocket, Stash, Sing-box, Quantumult X

### Android
1. Скачай [v2rayNG](https://play.google.com/store/apps/details?id=com.v2ray.ang) из Play Market
2. Открой веб-приложение → кнопка **«Скачать / Вставить в приложение»**
3. Выбери Android — конфиг скопируется и откроется в v2rayNG

**Альтернативы:** NekoBox, Hiddify, Sing-box, v2rayNG Plus

### Windows / macOS / Linux
1. Скачай [Nekoray](https://github.com/MatsuriDayo/nekoray) или [Hiddify](https://hiddify.com)
2. Скопируй VLESS/Hysteria2 ссылку из бота или веб-приложения
3. Вставь в приложение — готово!

---

## 🏗 Архитектура проекта

```
XservisVPN/
├── xservis-vpn/          # React-приложение (Vite + TypeScript)
│   ├── src/
│   │   ├── components/   # UI компоненты (TabBar, ConnectButton, ...)
│   │   ├── pages/        # Страницы (Home, Servers, Stats, AI)
│   │   ├── store/        # Zustand store + данные серверов
│   │   ├── themes/       # 12 тем оформления
│   │   └── types/        # AI Routing Engine
│   └── dist/             # Сборка
├── bot/                  # Telegram бот (Node.js + Telegraf)
│   └── index.js          # Основной код бота
├── public/               # Статика для хостинга
├── vercel.json           # Vercel конфиг
└── README.md             # Этот файл
```

### AI Routing Engine
1. Определяет регион и провайдера по IP
2. Анализирует доступные серверы (рейтинг по стране, провайдеру, загрузке)
3. Подбирает оптимальный SNI, порт, протокол
4. При недоступности — автоматический перебор:
   - Сменить SNI → Порт → Транспорт → Сервер → Маршрут → DNS
5. Фоновая Smart Rotation каждые 15 секунд

---

## 🔧 Запуск локально

### Веб-приложение:
```bash
cd XservisVPN/xservis-vpn
npm install
npm run dev
# Открой http://localhost:5173
```

### Telegram бот:
```bash
cd XservisVPN/bot
npm install
node index.js
# Бот запущен на localhost:3000
```

---

## 🚀 Деплой

### Vercel (фронтенд):
```bash
cd XservisVPN
npx vercel --prod
```

### Telegram бот (Railway/Render):
```bash
cd XservisVPN/bot
# Залей на Railway или Render
# Укажи команду запуска: node index.js
# Добавь переменную BOT_TOKEN
```

---

## 📊 Статистика

| Метрика | Значение |
|---------|----------|
| Серверов | 7 |
| Протоколов | 4 |
| SNI доменов | 15 |
| Портов | 10 |
| Тем оформления | 12 |
| Языков | 2 (RU/EN) |
| Платформ | iOS, Android, Web |

---

## 🛡 Приоритет трафика

Все конфиги настроены на приоритет:
- 💬 **WhatsApp**
- ▶️ **YouTube**
- ✈️ **Telegram**
- 📸 **Instagram**
- 🌐 Все остальные сайты

---

## 🤖 AI Assistant

- Анализирует качество соединения
- Ведёт историю успешных/неудачных подключений
- Предлагает оптимальные параметры на основе эвристик
- Автоматически перебирает конфигурации при недоступности

---

## 📄 Лицензия

MIT © 2026 XservisVPN

---

**🚀 Готов к использованию!** Открой [@XservisVPN_bot](https://t.me/XservisVPN_bot) или [веб-версию](https://aima666qs-commits.github.io/XservisVPN)
