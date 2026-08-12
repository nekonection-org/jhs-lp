# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=24.18.0
ARG ALPINE_VERSION=3.24

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable

FROM base AS dependencies

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm config set store-dir /pnpm/store && \
    pnpm install --frozen-lockfile

FROM dependencies AS builder

WORKDIR /app

COPY . .

ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_DISCORD_INVITE_URL
ARG NEXT_PUBLIC_RUST_SERVER_ADDRESS
ARG NEXT_PUBLIC_TEBEX_URL
ARG NEXT_PUBLIC_MODERATOR_APPLICATION_URL

ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_PUBLIC_DISCORD_INVITE_URL=${NEXT_PUBLIC_DISCORD_INVITE_URL}
ENV NEXT_PUBLIC_RUST_SERVER_ADDRESS=${NEXT_PUBLIC_RUST_SERVER_ADDRESS}
ENV NEXT_PUBLIC_TEBEX_URL=${NEXT_PUBLIC_TEBEX_URL}
ENV NEXT_PUBLIC_MODERATOR_APPLICATION_URL=${NEXT_PUBLIC_MODERATOR_APPLICATION_URL}

RUN pnpm validate:env && mkdir -p public && pnpm build

FROM dependencies AS migrator

WORKDIR /app

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

RUN chown -R node:node /app/node_modules/.pnpm/@prisma+engines@*/node_modules/@prisma/engines

ENV NODE_ENV=production

USER node

CMD ["./node_modules/.bin/prisma", "migrate", "deploy"]

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup -S -g 1001 nodejs && \
    adduser -S -D -H -u 1001 -G nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -q -T 4 --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
