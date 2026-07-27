#!/bin/bash
# ====== Деплой XservisVPN на VPS 82.26.94.154 ======
set -e

VPS_IP="82.26.94.154"
DOMAIN="aima.mom"
echo "🚀 Деплой XservisVPN на VPS $VPS_IP"

# 1. Создаём папку на сервере
ssh root@$VPS_IP "mkdir -p /opt/xservisvpn" 2>/dev/null || {
  echo "❌ Не могу подключиться к $VPS_IP"
  echo ""
  echo "⚠️  ДЕЛАЙ ВРУЧНУЮ:"
  echo ""
  echo "1. Открой Termius и подключись к $VPS_IP (root)"
  echo "2. Выполни команды:"
  echo "----------------------------------------"
  echo "apt update && apt upgrade -y"
  echo "apt install -y nginx certbot python3-certbot-nginx nodejs npm git"
  echo ""
  echo "3. Скопируй файлы:"
  echo "   scp -r /c/Users/kkkj/XservisVPN/public/* root@$VPS_IP:/var/www/xservisvpn/"
  echo ""
  echo "4. Настрой Nginx:"
  echo "   nano /etc/nginx/sites-available/$DOMAIN"
  echo "----------------------------------------"
  echo ""
  echo "👉 И ГЛАВНОЕ: в панели регистратора домена aima.mom"
  echo "   добавь A-запись: @ → $VPS_IP"
  exit 1
}

# 2. Копируем файлы
echo "📁 Копируем файлы..."
rsync -avz --delete /c/Users/kkkj/XservisVPN/public/ root@$VPS_IP:/var/www/xservisvpn/

# 3. Настройка Nginx
echo "🌐 Настройка Nginx..."
ssh root@$VPS_IP "cat > /etc/nginx/sites-available/$DOMAIN << 'NGINX'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/xservisvpn;
    index index.html;

    # SPA fallback
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}
NGINX
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx"

# 4. SSL
echo "🔐 SSL..."
ssh root@$VPS_IP "certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || echo 'SSL нужно сделать вручную: certbot --nginx -d $DOMAIN'"

echo ""
echo "✅ Готово!"
echo "🌐 Сайт: https://$DOMAIN"
echo "⏱ DNS может обновляться до 30 минут"
