FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

# Rstringir por grupo de usuario
RUN addgroup -S appgroup && adduser -S nodeuser -G appgroup

WORKDIR /app

COPY --chown=nodeuser:appgroup --from=builder /app/dist ./dist
COPY --chown=nodeuser:appgroup --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3000

USER nodeuser

ENV NODE_ENV=production

CMD ["node", "dist/infrastructure/bootstrap/App.js"]
