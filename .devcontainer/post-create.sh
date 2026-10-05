#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Named volumes can retain an older UID after a Linux host changes users.
sudo chown -R "$(id -u):$(id -g)" \
  node_modules .next /home/node/.local/share/pnpm/store \
  "${PLAYWRIGHT_BROWSERS_PATH}"

pnpm config set store-dir /home/node/.local/share/pnpm/store --global
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate:deploy
DATABASE_NAME=jhs_test pnpm db:migrate:deploy
pnpm exec playwright install --with-deps chromium

printf '\nDevelopment environment ready. Run: pnpm dev --hostname 0.0.0.0\n'
