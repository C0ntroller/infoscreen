FROM node:alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ENV GATSBY_TELEMETRY_DISABLED 1
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/public .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]