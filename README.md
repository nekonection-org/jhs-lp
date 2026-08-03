# Japan Hideaway Server LP

Japan Hideaway Server の公式案内用シングルページLPです。サーバー情報、ルール、VIP、FAQ、モデレーター募集、お知らせを同一ページ内で案内します。

## 必要な環境

- Node.js 24（CI・Dockerでは `24.18.0` を使用）
- pnpm（`package.json` の `packageManager` で指定されたバージョン）
- Docker / Docker Compose（コンテナで実行する場合）

## ローカル開発

Corepackを有効化し、lockfileどおりに依存関係をインストールします。

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

ブラウザで `http://localhost:3000` を開きます。`.env.local` の各URLには、実際に管理している公開URLだけを設定してください。未確定のURLは空欄のままにし、仮のリンクを本番へ公開しないでください。

## 環境変数

| 変数                                    | 用途                                        |
| --------------------------------------- | ------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                  | 公開サイトのcanonical URL、OGP、sitemapなど |
| `NEXT_PUBLIC_DISCORD_INVITE_URL`        | Discord参加リンク                           |
| `NEXT_PUBLIC_RUST_SERVER_ADDRESS`       | F1コマンド・Steam起動ボタン用の接続先       |
| `NEXT_PUBLIC_TEBEX_URL`                 | VIP購入ページへの外部リンク                 |
| `NEXT_PUBLIC_MODERATOR_APPLICATION_URL` | モデレーター応募チャンネルまたはフォーム    |
| `NEXT_PUBLIC_X_URL`                     | 公式Xアカウントへの外部リンク               |

`NEXT_PUBLIC_` で始まる値はビルド時にクライアントコードへ埋め込まれ、ブラウザから参照できます。Bot Token、RCONパスワード、APIキーなどの秘密情報は設定しないでください。

Rustの接続先にはURLではなく、ホスト名と必要に応じてポートを指定します。Heroのカードには、この値からF1用コマンドとSteam起動リンクが自動生成されます。

```env
NEXT_PUBLIC_RUST_SERVER_ADDRESS=play.jhs.nekonection.com
```

## お知らせの追加

お知らせは`src/content/ja.ts`と`src/content/en.ts`にある`news.items`へ追加します。両言語で同じ`id`、`publishedAt`、`category`を使用し、新しい項目を配列の先頭へ置いてください。

```ts
items: [
  {
    id: "announcement-id",
    publishedAt: "2026-08-03",
    category: "notice",
    title: "実際のお知らせタイトル",
    description: "実際のお知らせ概要",
  },
],
```

英語側にも同じIDで対応する翻訳を追加します。

```ts
items: [
  {
    id: "announcement-id",
    publishedAt: "2026-08-03",
    category: "notice",
    title: "Actual announcement title",
    description: "Actual announcement summary",
  },
],
```

`category`には`notice`、`maintenance`、`update`、`event`、`important`、`incident`を指定できます。Discord投稿などへリンクする場合は、両言語の項目へHTTPSの`url`を追加してください。架空のお知らせは本番へ追加しないでください。

## 品質チェック

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

E2Eテストを実行する場合は、Playwrightのブラウザを準備してから実行します。

```powershell
pnpm exec playwright install chromium
pnpm test:e2e
```

## Docker

Docker Composeはプロジェクト直下の `.env` をビルド引数として読み込みます。最初にサンプルをコピーし、必要な公開URLを設定します。

コンテナビルドでは `NEXT_PUBLIC_SITE_URL` と `NEXT_PUBLIC_DISCORD_INVITE_URL` を必須とし、HTTPSの公開URLであることを検証します。空欄、localhost、予約済みテスト用ドメインのままでは本番イメージを作成しません。

```powershell
Copy-Item .env.example .env
docker compose build
docker compose up -d
docker compose ps
```

ログは次のコマンドで確認できます。

```powershell
docker compose logs -f web
```

コンテナはNext.jsのstandalone出力を、非rootユーザーでポート`3000`に公開します。DockerfileにはHTTPヘルスチェックがあり、`docker compose ps` の `healthy` 表示で起動状態を確認できます。

## CIとコンテナ公開

Pull Requestと`main`へのpushでは、GitHub ActionsのCIが型チェック、Lint、Prettier、Unit Test、Production Buildを実行します。

`main`へのpushに対するCIが成功した場合だけ、別ワークフローが同じ検証済みコミットからDockerイメージをビルドし、GHCRへ次のタグで公開します。

- `latest`
- `sha-<検証済みコミットの短縮SHA>`

GitHubリポジトリのActions Variablesには、必要に応じて `.env.example` と同名の公開URLを登録してください。ワークフローはイメージの公開までを担当し、本番環境への自動デプロイは行いません。Cloudflare Tunnelやnginxなど、本番の公開経路とロールバック手順が確定した後に、デプロイ工程を別途設計します。

## フォントライセンス

英数字には、SIL Open Font License 1.1で提供されるGeistを`next/font/local`で自己配信します。ライセンス本文は`src/app/fonts/OFL.txt`に含まれています。日本語は端末のシステムフォントを使用します。
