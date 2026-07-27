FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --production

# Copy everything
COPY . .

# Build React app (if needed)
RUN cd xservis-vpn && npm install && npm run build && cp -r dist/* ../public/

EXPOSE 443

WORKDIR /app/server

CMD ["node", "index.js"]
