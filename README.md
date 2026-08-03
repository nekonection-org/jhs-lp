# Japan Hideaway Server LP

Rustコミュニティサーバー「Japan Hideaway Server」の公式案内用ランディングページです。複数ページへ遷移せず、サーバー情報、ルール、VIP、FAQ、モデレーター募集、お知らせ、利用規約を1ページ内で案内します。

## 主な機能

- 日本語・英語の表示切り替えと選択内容の保存
- ダーク・ライトテーマの切り替え（初期値はダーク）
- 同一ページ内のアンカーナビゲーションとモバイルメニュー
- F1接続コマンドのコピーとSteam経由のRust起動
- Discord、Tebex、モデレーター応募先への外部リンク
- ネイティブ`details`を使用したFAQ
- ボタンから開く利用規約モーダル
- TypeScriptコンテンツによるルール・FAQ・お知らせ管理
- Reduced Motion、キーボード操作、レスポンシブ表示への対応

## 技術構成

- Next.js 16 / React 19 / TypeScript
- Tailwind CSS v4
- Motion for React
- next-themes
- Vitest / React Testing Library / Playwright
- Docker / Docker Compose / GitHub Actions

## 必要な環境

- Node.js 24（CI・Dockerでは`24.18.0`）
- pnpm 10（正確なバージョンは`package.json`を参照）
- Docker / Docker Compose（コンテナで実行する場合）

## ローカル開発

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

ブラウザで`http://localhost:3000`を開きます。PowerShellの実行ポリシーによって`pnpm.ps1`が実行できない場合は、`pnpm.cmd`を使用してください。

## 環境変数

`.env.example`を`.env.local`へコピーし、実際に管理している公開URLと接続先を設定します。

```env
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/example
NEXT_PUBLIC_RUST_SERVER_ADDRESS=play.jhs.nekonection.com
NEXT_PUBLIC_TEBEX_URL=
NEXT_PUBLIC_MODERATOR_APPLICATION_URL=
```

| 変数                                    | 必須             | 用途                                             |
| --------------------------------------- | ---------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                  | 本番ビルドで必須 | canonical URL、OGP、robots.txt、sitemap.xml      |
| `NEXT_PUBLIC_DISCORD_INVITE_URL`        | 本番ビルドで必須 | HeroやヘッダーなどのDiscord参加リンク            |
| `NEXT_PUBLIC_RUST_SERVER_ADDRESS`       | 任意             | F1接続コマンドとSteam起動リンク（`host[:port]`） |
| `NEXT_PUBLIC_TEBEX_URL`                 | 任意             | VIP購入ページ                                    |
| `NEXT_PUBLIC_MODERATOR_APPLICATION_URL` | 任意             | モデレーター応募チャンネルまたは応募フォーム     |

`NEXT_PUBLIC_`で始まる値はビルド時にブラウザ向けコードへ埋め込まれます。Bot Token、RCONパスワード、APIキーなどの秘密情報は設定しないでください。

### Discord URLの設定場所

ローカル環境では`.env.local`へ設定します。

```env
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/実際の招待コード
```

Docker Composeではプロジェクト直下の`.env`、GHCR向けGitHub ActionsではRepository Variablesの`NEXT_PUBLIC_DISCORD_INVITE_URL`を使用します。

### Rust接続先の設定

URLやF1コマンド全体ではなく、ホスト名と必要に応じてポートだけを設定します。

```env
NEXT_PUBLIC_RUST_SERVER_ADDRESS=play.jhs.nekonection.com
```

設定するとHero右側のカードへ次の操作が表示されます。

- F1コンソール用の`client.connect play.jhs.nekonection.com`をコピー
- `steam://run/252490//+connect ...`形式のリンクからSteamとRustを起動

## コンテンツの更新

主要な文章は次の2ファイルで管理しています。

- `src/content/ja.ts`: 日本語
- `src/content/en.ts`: 英語

項目を追加・削除する場合は両言語で同じ`id`を使用し、必要に応じて`src/content/types.ts`のID一覧と型も更新してください。日英でIDが一致しない場合、表示時に`Localized content item is missing`エラーになります。

### お知らせの追加

`ja.ts`と`en.ts`の`news.items`へ、同じID・公開日・カテゴリを持つ項目を追加します。新しいお知らせは配列の先頭へ置きます。

```ts
{
  id: "announcement-id",
  publishedAt: "2026-08-03",
  category: "notice",
  title: "実際のお知らせタイトル",
  description: "実際のお知らせ概要",
}
```

英語側には同じ`id`で翻訳を追加します。カテゴリには`notice`、`maintenance`、`update`、`event`、`important`、`incident`を指定できます。Discord投稿などへ誘導する場合は、両言語の項目へHTTPSの`url`を追加できます。架空のお知らせは本番へ掲載しないでください。

### 利用規約の更新

利用規約は`ja.ts`と`en.ts`の`terms`で管理しています。Footer直前の「利用規約を表示」ボタンからモーダルで開きます。条文を変更する場合は、両言語の`articles`と`lastUpdated`を合わせて更新してください。

### 画像の差し替え

- `public/icon.png`: ヘッダー、Heroカード、Footerで使用する公式アイコン
- `public/main-image.png`: Heroのメイン画像

ファイル名を維持して差し替えると、コンポーネント側の変更は不要です。

## 品質チェック

変更後は次のコマンドを実行します。

```powershell
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

UIやナビゲーションを変更した場合はE2Eテストも実行します。

```powershell
pnpm exec playwright install chromium
pnpm test:e2e
```

## Docker

Docker Composeはプロジェクト直下の`.env`をビルド引数として読み込みます。

```powershell
Copy-Item .env.example .env
docker compose build
docker compose up -d
docker compose ps
```

本番イメージのビルドでは`NEXT_PUBLIC_SITE_URL`と`NEXT_PUBLIC_DISCORD_INVITE_URL`を必須とし、HTTPSの公開URLであることを検証します。空欄、localhost、予約済みテスト用ドメインではビルドに失敗します。Rust接続先を設定した場合は、ホスト名と`1`から`65535`までの任意ポートだけを許可します。

ログは次のコマンドで確認できます。

```powershell
docker compose logs -f web
```

コンテナはNext.jsのstandalone出力を非rootユーザーで実行し、ポート`3000`を公開します。HTTPヘルスチェックの状態は`docker compose ps`で確認できます。

## CIとコンテナ公開

Pull Requestと`main`へのpushでは、GitHub Actionsが次の処理を実行します。

- 依存関係の固定インストール
- Typecheck
- ESLint
- Prettier
- Unit Test
- Production Build

`main`へのpushに対するCIが成功した場合、検証済みコミットからDockerイメージをビルドしてGHCRへ公開します。

- `latest`
- `sha-<検証済みコミットの短縮SHA>`

Repository Variablesには、`.env.example`と同名の公開設定を登録してください。ワークフローはイメージ公開までを担当し、本番環境への自動デプロイは行いません。

## プロジェクト構成

```text
src/
├── app/          # App Router、metadata、manifest、robots、sitemap
├── components/   # Header、Footer、各セクション、共通UI、Provider
├── content/      # 日本語・英語コンテンツと型定義
├── hooks/        # アクティブセクションなどのHooks
├── lib/          # URL・接続先設定、共通関数
└── tests/        # Unit / Component Test
e2e/              # Playwright E2E Test
public/           # 公式アイコンとHero画像
```

## フォントライセンス

英数字にはSIL Open Font License 1.1で提供されるGeistを`next/font/local`で自己配信します。ライセンス本文は`src/app/fonts/OFL.txt`に含まれています。日本語は端末のシステムフォントを使用します。
