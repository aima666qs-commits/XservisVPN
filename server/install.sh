#!/bin/bash
set -e

# ====== XservisVPN — Полная установка на VPS ======
# Использование: sudo bash install.sh
# Требуется: Ubuntu 22.04+, root/ sudo

echo "🚀 XservisVPN — Установка на VPS"

# 1. Обновление системы
echo "📦 Обновление пакетов..."
apt update -y && apt upgrade -y

# 2. Установка Node.js 22
echo "📦 Установка Node.js..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs git nginx certbot python3-certbot-nginx

# 3. Клонирование репозитория
echo "📂 Клонирование XservisVPN..."
if [ ! -d "/opt/xservisvpn" ]; then
  git clone https://github.com/aima666qs-commits/XservisVPN /opt/xservisvpn
fi

cd /opt/xservisvpn

# 4. Установка зависимостей
echo "📦 Установка npm зависимостей..."
cd server && npm install && cd ..

# 5. Настройка домена
echo "🔗 Введи домен (например: xservisvpn.ru):"
read DOMAIN
echo "DOMAIN=$DOMAIN" > server/.env
echo "BOT_TOKEN=8140147139:AAFV2IAQxkPCpLCkqPG7D5RKS6K6t2w6M2s" >> server/.env
echo "PORT=443" >> server/.env
echo "HTTP_PORT=80" >> server/.env

# 6. SSL сертификат
echo "🔐 Получение SSL сертификата..."
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || echo "⚠️ SSL нужно настроить вручную"

# 7. Systemd service
echo "⚙️ Создание systemd service..."
cat > /etc/systemd/system/xservisvpn.service << 'EOF'
[Unit]
Description=XservisVPN Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/xservisvpn/server
ExecStart=/usr/bin/node /opt/xservisvpn/server/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=443
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable xservisvpn
systemctl start xservisvpn

# 8. Nginx reverse proxy
echo "🌐 Настройка Nginx..."
cat > /etc/nginx/sites-available/$DOMAIN << EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;

    # Скрываем, что это Node.js
    proxy_hide_header X-Powered-By;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;

    location / {
        proxy_pass http://127.0.0.1:443;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        # WebSocket support
        proxy_read_timeout 86400;
    }

    # Статика кешируется
    location /assets/ {
        proxy_pass http://127.0.0.1:443;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 9. Мониторинг
echo "📊 Включение мониторинга..."
cat > /etc/systemd/system/xservisvpn-health.sh << 'EOF'
#!/bin/bash
# Проверка, что сервер жив
if ! curl -sf http://127.0.0.1:443/api/health > /dev/null; then
  systemctl restart xservisvpn
  echo "$(date): XservisVPN перезапущен" >> /var/log/xservisvpn-health.log
fi
EOF

chmod +x /etc/systemd/system/xservisvpn-health.sh

# Cron проверка каждые 5 минут
echo "*/5 * * * * root /etc/systemd/system/xservisvpn-health.sh" > /etc/cron.d/xservisvpn-health

# 10. Перезапуск
systemctl restart xservisvpn

echo ""
echo "==========================================="
echo "✅ XservisVPN установлен!"
echo "🌐 Сайт: https://$DOMAIN"
echo "🤖 Бот: @Xserv1sbot"
echo "📡 Статус:"
systemctl status xservisvpn --no-pager
echo "==========================================="
