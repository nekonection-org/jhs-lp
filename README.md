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
- TypeScriptコンテンツによるルールなどの静的コンテンツ管理
- MySQLと管理画面によるお知らせ・FAQの下書き、公開、アーカイブ管理
- Cloudflare Accessとアプリ内権限検証による管理画面保護
- お知らせ・FAQ変更の操作ログと、お知らせの管理者限定プレビュー
- Reduced Motion、キーボード操作、レスポンシブ表示への対応

## 技術構成

- Next.js 16 / React 19 / TypeScript
- Prisma ORM / MySQL 8.4 LTS
- Cloudflare Access / Cloudflare Tunnel
- Tailwind CSS v4
- Motion for React
- next-themes
- Vitest / React Testing Library / Playwright
- Docker / Docker Compose / GitHub Actions

## 必要な環境

- Node.js 24（CI・Dockerでは`24.18.0`）
- pnpm 10（正確なバージョンは`package.json`を参照）
- Docker / Docker Compose（MySQLと本番コンテナで使用）

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

DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=jhs_app
DATABASE_PASSWORD=
DATABASE_NAME=jhs

CLOUDFLARE_ACCESS_TEAM_DOMAIN=https://your-team.cloudflareaccess.com
CLOUDFLARE_ACCESS_AUD=
ADMIN_ALLOWED_EMAILS=
```

| 変数                                    | 必須             | 用途                                             |
| --------------------------------------- | ---------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                  | 本番ビルドで必須 | canonical URL、OGP、robots.txt、sitemap.xml      |
| `NEXT_PUBLIC_DISCORD_INVITE_URL`        | 本番ビルドで必須 | HeroやヘッダーなどのDiscord参加リンク            |
| `NEXT_PUBLIC_RUST_SERVER_ADDRESS`       | 任意             | F1接続コマンドとSteam起動リンク（`host[:port]`） |
| `NEXT_PUBLIC_TEBEX_URL`                 | 任意             | VIP購入ページ                                    |
| `NEXT_PUBLIC_MODERATOR_APPLICATION_URL` | 任意             | モデレーター応募チャンネルまたは応募フォーム     |

`NEXT_PUBLIC_`で始まる値はビルド時にブラウザ向けコードへ埋め込まれます。Bot Token、RCONパスワード、APIキーなどの秘密情報は設定しないでください。

DB接続情報、Cloudflare Access設定、管理者メールアドレスはサーバー側だけで使用します。`DATABASE_PASSWORD`はローカル開発用です。本番Dockerでは環境変数へパスワードを直接設定せず、`secrets/mysql-password`を読み込みます。

| サーバー側変数                  | 用途                                                          |
| ------------------------------- | ------------------------------------------------------------- |
| `DATABASE_HOST`                 | MySQLホスト。本番Composeでは`mysql`                           |
| `DATABASE_PORT`                 | MySQLポート。既定値は`3306`                                   |
| `DATABASE_USER`                 | アプリ専用MySQLユーザー                                       |
| `DATABASE_PASSWORD`             | ローカル開発用パスワード                                      |
| `DATABASE_PASSWORD_FILE`        | Docker secretのファイルパス。Composeが自動設定                |
| `DATABASE_NAME`                 | データベース名                                                |
| `CLOUDFLARE_ACCESS_TEAM_DOMAIN` | `https://<team>.cloudflareaccess.com`形式のAccess Team Domain |
| `CLOUDFLARE_ACCESS_AUD`         | Self-hosted applicationのApplication Audience（AUD）          |
| `ADMIN_ALLOWED_EMAILS`          | 管理を許可するメールアドレスのカンマ区切り一覧                |
| `ADMIN_DEV_BYPASS`              | 開発環境だけで有効なローカル認証バイパス                      |
| `ADMIN_DEV_EMAIL`               | 開発バイパスで使用する、許可リスト内のメールアドレス          |

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

見出しや案内文などの静的な文章は次の2ファイルで管理しています。

- `src/content/ja.ts`: 日本語
- `src/content/en.ts`: 英語

静的な項目を追加・削除する場合は両言語で同じ`id`を使用し、必要に応じて`src/content/types.ts`のID一覧と型も更新してください。日英でIDが一致しない場合、表示時に`Localized content item is missing`エラーになります。お知らせとFAQの本文はTypeScriptではなく管理画面から更新します。

### お知らせの追加

お知らせはTypeScriptへ直接追加せず、Cloudflare Accessで保護された`/admin/news`から管理します。下書きでは英語を省略できますが、公開または予約公開には日本語・英語の両方が必要です。

- `下書き`: 公開サイトには表示されず、管理画面内だけでプレビューできます。
- `公開`: 公開日時が現在以前なら公開サイトへ表示されます。
- `予約公開`: 公開状態のまま未来の公開日時を指定します。日時は日本時間（JST）で入力し、DBにはUTCで保存します。
- `アーカイブ`: 公開対象から外します。お知らせと操作ログは削除しません。

公開サイトは公開日時が新しい順に最大5件を表示します。予約時刻の到来は最大約60秒のキャッシュ遅延が生じる場合があります。管理画面からの保存時は公開キャッシュを即時無効化します。

### FAQの更新

FAQはCloudflare Accessで保護された`/admin/faqs`から管理します。日本語の質問と回答は常に必須で、公開時は英語も必須です。

- `下書き`: 公開サイトには表示されません。英語は省略できます。
- `公開`: 日英の質問と回答を公開サイトへ表示します。
- `表示順`: 0から9999までの整数を指定し、数字が小さいFAQから表示します。
- `確認済み / 準備中`: 回答内容の確認状態です。準備中の場合は公開サイトにも状態を表示します。
- `アーカイブ`: 公開対象から外します。FAQと操作ログは削除しません。

既存のFAQはマイグレーションでDBへ移行されます。公開FAQは最大約60秒キャッシュされますが、管理画面からの保存時はFAQキャッシュを即時無効化します。

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
pnpm db:validate
pnpm build
```

UIやナビゲーションを変更した場合はE2Eテストも実行します。

```powershell
pnpm exec playwright install chromium
pnpm test:e2e
```

MySQL統合テストはマイグレーション済みのテストDBに対して実行します。`RUN_DATABASE_INTEGRATION=true`を指定しない通常のUnit Testでは、DB統合テストをスキップします。CIではMySQL 8.4.10を起動し、マイグレーション適用後にお知らせとFAQの統合テストを自動実行します。

## Docker

Docker ComposeはMySQL、1回限りのマイグレーター、Next.js、Cloudflare Tunnelを起動します。MySQLとWebのポートはホストへ公開せず、Cloudflare Tunnelだけを本番入口にします。

最初に環境変数とDocker secretsを用意します。生成したファイルは`.gitignore`対象です。

```powershell
Copy-Item .env.example .env
New-Item -ItemType Directory -Force secrets | Out-Null
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)) | Set-Content -NoNewline secrets/mysql-password
[Convert]::ToBase64String([Security.Cryptography.RandomNumberGenerator]::GetBytes(32)) | Set-Content -NoNewline secrets/mysql-root-password
Read-Host "Cloudflare Tunnel token" | Set-Content -NoNewline secrets/cloudflare-tunnel-token
```

`.env`へ公開URL、Access設定、DB名とDBユーザーを設定してから起動します。

```powershell
docker compose build
docker compose up -d
docker compose ps -a
```

`migrate`が終了コード0で完了してから`web`が起動します。本番イメージのビルドでは`NEXT_PUBLIC_SITE_URL`と`NEXT_PUBLIC_DISCORD_INVITE_URL`を必須とし、HTTPSの公開URLであることを検証します。空欄、localhost、予約済みテスト用ドメインではビルドに失敗します。

ログは次のコマンドで確認できます。

```powershell
docker compose logs migrate
docker compose logs -f web
```

Next.jsとマイグレーターは非rootユーザーで実行します。MySQLは永続volume`mysql_data`へ保存されます。公開サイトはDB障害時にもページ全体を500にせず、お知らせ欄とFAQ欄へ取得失敗を表示します。管理画面は認証設定が欠けている場合に503で閉じます。

### ローカル管理画面開発

ローカル開発時だけ`compose.dev.yml`を重ね、MySQLを`127.0.0.1:3307`へ限定公開できます。本番ではこの上書きファイルを使用しません。

```powershell
docker compose -f compose.yml -f compose.dev.yml build migrate
docker compose -f compose.yml -f compose.dev.yml up -d mysql migrate
```

マイグレーションを追加した後は、古い`jhs-lp-migrator:local`を再利用しないよう、先に`build migrate`を実行してください。

`.env.local`ではローカル公開ポート`3307`とsecretファイルを指定します。パスワード値を`.env.local`へ複製する必要はありません。

```env
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3307
DATABASE_USER=jhs_app
DATABASE_PASSWORD_FILE=secrets/mysql-password
DATABASE_NAME=jhs
```

Cloudflareログインを使わないローカル開発に限り、次を設定できます。

```env
ADMIN_ALLOWED_EMAILS=local-admin@example.com
ADMIN_DEV_BYPASS=true
ADMIN_DEV_EMAIL=local-admin@example.com
```

環境変数を変更した場合は、起動中の`pnpm dev`を再起動してください。このバイパスは`NODE_ENV=development`以外では必ず無効になります。本番で`ADMIN_DEV_BYPASS=true`を設定しても認証を通過しません。

### バックアップ

本番更新とマイグレーションの前にMySQLをバックアップします。PowerShellでは出力文字コードをUTF-8へ固定します。

```powershell
docker compose exec -T mysql sh -c 'MYSQL_PWD="$(cat "$MYSQL_ROOT_PASSWORD_FILE")" mysqldump --single-transaction --routines --triggers --user=root "$MYSQL_DATABASE"' | Out-File -Encoding utf8 jhs-backup.sql
```

復元は停止時間と対象DBを確認したうえで実施してください。

```powershell
Get-Content -Raw jhs-backup.sql | docker compose exec -T mysql sh -c 'MYSQL_PWD="$(cat "$MYSQL_ROOT_PASSWORD_FILE")" mysql --user=root "$MYSQL_DATABASE"'
```

本番では`prisma migrate dev`を実行しません。`docker compose up -d`が`prisma migrate deploy`専用コンテナを実行します。マイグレーション失敗時はWebを起動せず、既存コンテナとバックアップを維持して原因を確認します。

## Cloudflare Access

Cloudflare側のAccess ApplicationとAllow policyはリポジトリから自動作成されません。本番公開前にZero Trust管理画面で設定してください。

1. TunnelのPublic Hostnameを`web:3000`へ向けます。オリジンのポートはインターネットへ直接公開しません。
2. Self-hosted applicationで、公開ホストの`/admin`と`/admin/*`の両方を保護します。Cloudflare Accessでは`/admin/*`だけでは親の`/admin`を含みません。
3. Allow policyには管理者のメールアドレスを明示します。管理画面で`Everyone`や`Bypass`を使用せず、セッション時間も必要最小限にします。
4. Application Audience（AUD）とTeam Domainを`.env`へ設定し、同じ管理者を`ADMIN_ALLOWED_EMAILS`へ登録します。
5. 必要に応じてBinding Cookieを有効化します。Tunnel経由でServer ActionのHost不一致が起きる場合だけ、正確な本番ホストを`serverActions.allowedOrigins`へ追加します。ワイルドカードは使用しません。

アプリは`Cf-Access-Jwt-Assertion`をCloudflareのリモートJWKSで検証し、署名、issuer、audience、有効期限、token type、subject、emailを確認します。その後、メールアドレスの許可リストを全管理ページと全更新処理で再確認します。メールヘッダーだけを信用せず、JWTやCookieを操作ログへ保存しません。

- JWTなし・不正: 401
- JWTは有効だが許可リスト外: 403
- Access設定または鍵取得に問題がある: 503

いずれもキャッシュせず、検証エラーやトークン内容をレスポンスへ公開しません。

## 操作ログ

お知らせとFAQの作成・更新・アーカイブは、それぞれの操作ログと同じMySQLトランザクションで保存します。操作ログの保存に失敗した場合、コンテンツ変更もロールバックされます。`/admin/audit`では最新100件の操作者、操作、対象種別とID、変更前後を参照できますが、編集・削除機能は提供しません。

## CIとコンテナ公開

Pull Requestと`main`へのpushでは、GitHub Actionsが次の処理を実行します。

- 依存関係の固定インストール
- Typecheck
- ESLint
- Prettier
- Unit Test
- MySQLマイグレーション
- MySQL統合テスト（予約公開、FAQ表示順、監査ログ、トランザクションロールバック）
- Production Build

`main`へのpushに対するCIが成功した場合、検証済みコミットからDockerイメージをビルドしてGHCRへ公開します。

- `latest`
- `sha-<検証済みコミットの短縮SHA>`

Repository Variablesには、`.env.example`と同名の公開設定を登録してください。ワークフローはイメージ公開までを担当し、本番環境への自動デプロイは行いません。

## プロジェクト構成

```text
src/
├── app/          # App Router、公開LP、Access保護された管理画面
├── components/   # Header、各セクション、管理画面、共通UI
├── content/      # 日本語・英語コンテンツと型定義
├── hooks/        # アクティブセクションなどのHooks
├── lib/          # 認証、DB、お知らせ、FAQ、操作ログ、共通関数
└── tests/        # Unit / Component Test
prisma/           # MySQLスキーマとマイグレーション
e2e/              # Playwright E2E Test
public/           # 公式アイコンとHero画像
```

## フォントライセンス

英数字にはSIL Open Font License 1.1で提供されるGeistを`next/font/local`で自己配信します。ライセンス本文は`src/app/fonts/OFL.txt`に含まれています。日本語は端末のシステムフォントを使用します。
