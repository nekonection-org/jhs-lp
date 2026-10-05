# syntax=docker/dockerfile:1.7
FROM node:24.18.0-bookworm

ARG PNPM_VERSION=10.34.5

ENV NEXT_TELEMETRY_DISABLED=1
ENV PLAYWRIGHT_BROWSERS_PATH=/home/node/.cache/ms-playwright

RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates git openssl sudo && \
    rm -rf /var/lib/apt/lists/* && \
    corepack enable && \
    corepack prepare pnpm@${PNPM_VERSION} --activate && \
    printf 'node ALL=(ALL) NOPASSWD:ALL\n' > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

RUN mkdir -p /workspaces/jhs-lp/node_modules /workspaces/jhs-lp/.next \
        /home/node/.local/share/pnpm/store ${PLAYWRIGHT_BROWSERS_PATH} && \
    chown -R node:node /workspaces /home/node/.local /home/node/.cache

WORKDIR /workspaces/jhs-lp
USER node
CMD ["sleep", "infinity"]
