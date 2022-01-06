FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV GATSBY_TELEMETRY_DISABLED 1
RUN npm run build

FROM node:alpine AS runner
WORKDIR /app
RUN addgroup -g 1001 -S gatsby
RUN adduser -S gatsby -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
USER gatsby
EXPOSE 9000
ENV PORT 9000
ENV GATSBY_TELEMETRY_DISABLED 1
CMD ["node_modules/.bin/gatsby", "serve"]