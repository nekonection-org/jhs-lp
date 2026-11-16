# Japan Hideaway Server LP

Rustコミュニティサーバー「Japan Hideaway Server」の公式案内用ランディングページです。サーバー情報、ルール、VIP、FAQ、モデレーター募集、お知らせ、Discord参加案内、利用規約を1ページ内で案内します。個別のお知らせ本文は専用ページで表示します。

## 主な機能

- 日本語・英語の表示切り替えと選択内容の保存
- ダーク・ライトテーマの切り替え（初期値はダーク）
- 同一ページ内のアンカーナビゲーションとモバイルメニュー
- Hero・モバイルの追従バーからのDiscord参加導線
- 次回マップ・BPワイプの予定日時と残り日数・時間（選択タイムゾーンに連動）
- 選択したタイムゾーンの日付・時刻でレイド可否を確認（日本時間への換算・夏時間の重複時刻にも対応）
- F1接続コマンドのコピー、完了・失敗時のフィードバック、Steam経由のRust起動
- Discord、Tebex、モデレーター応募先への外部リンク
- ネイティブ`details`を使用したFAQ
- FAQの回答・お知らせの本文と管理者プレビューのMarkdown表示（Enter改行に対応）
- フッターのボタンから開く利用規約モーダル
- TypeScriptコンテンツによる静的案内とDB障害時のフォールバック
- MySQLと管理画面によるお知らせ・FAQ・VIP・モデレーター募集・サーバールールの管理
- Cloudflare Accessとアプリ内権限検証による管理画面保護
- 管理コンテンツ変更の操作ログと、お知らせの管理者限定プレビュー
- Reduced Motion、キーボード操作、レスポンシブ表示への対応

## 技術構成

- Next.js 16 / React 19 / TypeScript
- Prisma ORM / MySQL 8.4 LTS
- Cloudflare Access / Cloudflare Tunnel
- Tailwind CSS v4
- Motion for React
- react-markdown / remark-breaks / remark-gfm（FAQ・お知らせのサーバー側描画）
- next-themes
- Vitest / React Testing Library / Playwright
- Docker / Docker Compose / GitHub Actions

## デザインと共通UI

ブランドの緑（ダーク `#8fbd78` / ライト `#527d43`）とグレーの背景は維持します。色は`src/app/globals.css`のCSS変数で管理し、緑は参加ボタンと操作状態を中心に使います。

- Heroは「暮らしのペースで、Rustを楽しもう。」を中心に、静かな稜線・太陽・雲・小さな拠点の灯りをSVGで描きます。画像を読み込まず、日常の合間に自分の時間へ戻る雰囲気を表現します。本文18px・主要操作16pxを維持し、360×640pxでも最初の参加ボタンが画面内に収まります。
- 背景色はグレーを維持し、ブランドの緑は参加導線と操作状態を中心に使い、拠点の窓と入口には控えめな暖色を使います。Hero全体の背景として風景を横幅いっぱいに描き、石壁の小さな平屋拠点に、板金の三角ルーフ、窓1つ、コードロック付きの補強ドアを描いています。円形の枠を設けず、空と草原をHeroの背景につなげています。家と天体は中央寄りに配置し、端末の画面比率に合わせて形を保ったまま表示します。右側のフェードが消え切る位置は、下の区切り線と同じコンテンツ右端に揃えます。本文側・右端・下端には背景色のオーバーレイを重ね、文字の可読性と次のセクションへのつながりを保ちます。太陽と月の外周リングは表示しません。SVGは装飾として読み上げ・クリック対象から外します。
- 接続方法、サーバー設定、ワイプ予定、日時確認ツールは常に表示し、展開操作なしで確認できます。7日間のレイド時間表と「レイド時間を、ひと目で。」の図は表示しません。接続コマンドのコピーとSteam接続もそのまま操作できます。VIP詳細と「参加前に必ず確認してください」の注意書きは常に表示します。VIPは見出し・説明の下に内容を配置し、PCでは案内と特典を均等な2列、スマートフォンでは1列にします。追加ルールと募集条件は、共通の`SectionDisclosure`（ネイティブ`details` / `summary`）で必要なときに展開します。展開ラベルは`src/content/{ja,en}.ts`の`detailLabels`で編集します。接続案内の下には区切り線と下向きに動く矢印だけを表示し、キーボードでもサーバー情報へ移動できます。Reduced Motionでは矢印を静止させます。
- サーバー情報の紹介文は見出しの直下に左揃えで配置します。PCでも別の列へ分離せず、最大46remの行幅とバランスの取れた改行で読み順を揃えます。次回マップ・BPワイプと日時確認は最初から表示し、現地日時・タイムゾーン・残り時間を確認できます。日時確認はタイムゾーン→日付・時刻→判定結果の順に操作できます。サマータイムの重複・存在しない時刻への対応は維持しています。
- ルールの要約は最初の3項目を表示し、残りの項目と注意事項は「その他の重要ルール」にまとめます。全文は従来どおり別のネイティブ`details`で読めます。VIPは見出しと詳細の入口、モデレーター募集は説明・募集状況・応募導線を先に表示します。事実や提供内容は追加していません。
- FAQは質問一覧を主役にし、重複する参加ボタンを外しました。質問は18px、Markdown本文は18pxです。お知らせのMarkdownと改行、テーマ・言語の保存も維持します。
- コンテンツ最大幅は1200pxです。セクション間は80〜144pxの余白を取り、セクション見出しを24〜30px、Heroの見出しを32〜52pxに揃え、見出しとルール項目には補助アイコンを添えます。色や装飾的な番号ではなく、文字の大きさ・余白・読み順で情報の優先順位を示します。
- アンカー移動時は固定ヘッダーと24pxの余白を確保します。フォーカスリング、44px以上の操作領域、日英とテーマの保存、Reduced Motion対応を維持しています。
- `src/components/ui/Button.tsx` は [shadcn/ui Button](https://ui.shadcn.com/docs/components/button) のバリアント管理パターンを取り入れ、`class-variance-authority` で既存の `primary` / `secondary` / `quiet` APIを管理します。サイト固有の色とネイティブなbutton / aの意味を維持するローカル実装です。shadcn CLIによるテーマ一括置換は行っていません。
- `src/components/ui/FadeContent.tsx` は [React Bits FadeContent](https://github.com/DavidHDev/react-bits/blob/c83b5e7e026f003af33ff9ebc3d93afb5c86ad22/src/ts-tailwind/Animations/FadeContent/FadeContent.tsx) を基に調整しています。`Reveal`の`variant`で、本文の`rise`、左右から組み合わさる`split`、横方向に開く`wipe`、背景の拡大・マスク表示`aperture`を選べます。IntersectionObserverで画面に入った項目を一度だけ再生します。Heroは行単位の見出し→説明→参加導線を90msずつ、最大360msの遅延で表示します。
- `HeroRhythm`の背景は24秒の共通周期で、太陽と月が半周ずれた円軌道を一定の速さで回ります。両方とも左から昇って右の稜線へ沈み、地形の背後を通って次の周回へつながります。天体の見た目は逆回転で正立させ、途中の位置リセットやフェードは使いません。星・空の色・拠点の灯りは昼夜の周期に同期し、スクロールしなくても動きます。背景の停止・再生ボタンは設けていません。IntersectionObserverとPage Visibilityで画面外・非表示タブでは停止します。SVGの表示やスクロール連動はMotionを使用し、ホイール・タッチ操作は上書きしません。サーバーパネルの左右移動とルールの横マスクなど、セクション別の登場演出も維持します。
- SSR・JavaScript無効・IntersectionObserver非対応時も本文とSVGを静止表示します。Reduced Motionでは背景ループ・移動・拡縮・マスクを停止します。PCではルール・FAQの見出しがセクション内で追従します。採用コードとフォントの出典・ライセンスは`THIRD_PARTY_NOTICES.md`に記載しています。

### 操作へのフィードバック

- 次回マップ・BPワイプは既存の毎週金曜日18:00 JSTを基準に計算し、日時・残り日数・時分秒を毎秒更新します。レイド時間と同じタイムゾーン・時計・復帰時の同期を使います。予定時刻ちょうどに翌週へ切り替わり、実際のワイプ完了を示すものではありません。SSR・JavaScript無効時も基準の曜日・時刻は表示します。
- `ServerSchedule`が`#server`でワイプ予定・表示タイムゾーン・日時確認ツールを表示し、共通の時計で更新します。Heroに現在のレイド可否を表示するパネルは置きません。時計は毎秒更新し、タブ・ページへの復帰やフォーカス時にも再同期します。
- タイムゾーンの初期値は日本時間です。主要IANAタイムゾーンに加えて端末で検出した地域も選べます。選択を`jhs-raid-time-zone`へ保存し、保存が禁止されていてもその場で切り替えられます。不正な保存値は無視します。
- `RaidTimeChecker`は選択した地域の日付と分単位の時刻を入力し、日本時間へ換算してレイド可否を判定します。現地の曜日ではなく日本での平日／土日のルールを使い、結果に現地日時・UTCオフセット・換算後の日本時間を表示します。タイムゾーン変更時は入力した現地日時を保持して再判定し、言語変更時も選択を保持します。
- 夏時間の開始で存在しない時刻は、可能・禁止の判定を出さず変更を案内します。同じ時刻が2回現れる場合はUTCオフセットを選べます（初期値は早い方）。ネイティブのdate・time・selectを使用し、結果はアイコン・文言・`aria-live`で伝えます。
- セクションの段階表示、設定行の時間差表示、ワイプ日時・換算結果の短い切替、判定アイコンの反応を使います。進捗ラインとパネル全体のホバー移動は使用しません。Reduced Motionでは移動・拡縮を抑え、本文と操作結果を表示します。時計の毎秒更新にはアニメーションを付けません。
- モバイルの`MobileJoinBar`はHeroの参加ボタンがヘッダーより上へ移動してから表示し、フッターが見えている間とメニュー表示中は隠れます。IntersectionObserverで位置の変化を検知し、セーフエリアと画面下部のスクロール余白を確保しています。
- ボタンは150〜180msの色・矢印の変化と短い押下反応を使います。言語選択の背景は位置を移して切り替え、テーマのアイコンは短い回転とフェードで応答します。モバイルメニューの項目は25msずつずらして表示します。日時の確認結果とモバイルの参加バーも短い時間で切り替えます。
- FAQはネイティブ`details`の操作を維持し、対応ブラウザーではCSSで高さと濃度を220ms以内に切り替えます。[`interpolate-size`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/interpolate-size)は対応状況が異なるため、`@supports`で拡張し、未対応時は通常の開閉に戻します。
- コピー成功時はチェックアイコン・完了文言・コマンド枠で応答します。クリップボードへのアクセスが拒否された場合は、再試行するまで手動コピーの案内を残します。
- モバイルメニューからの移動後は見出しへフォーカスを移し、Escで閉じた場合はメニューボタンへ戻します。Reduced Motion時は移動・拡縮を抑え、操作結果を即時に伝えます。表示アニメーション中に設定を変更した場合も、進行中の処理を止めて濃度・位置を戻します。一度表示した要素はスクロールや設定変更で再生し直しません。
- JavaScriptが使えなくてもサーバー設定・基準のレイド時間と本文は表示されます。時刻確認の操作はハイドレーション後に有効になり、追従バーは拡張機能として追加されます。

UIの更新時は `pnpm typecheck`、`pnpm lint`、`pnpm format:check`、`pnpm test`、`pnpm build` に加えて `pnpm test:e2e` を実行します。360 / 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920pxで横スクロールと操作性を確認してください。DBを利用する統合テストと管理画面E2Eには、後述のDB設定が必要です。

## 必要な環境

- Node.js 24（CI・Dockerでは`24.18.0`）
- pnpm 10（正確なバージョンは`package.json`を参照）
- Docker / Docker Compose（MySQLと本番コンテナで使用）

## ローカル開発

### Dev Containerで開発する

Docker Desktop（WindowsではWSL 2とLinux containers）、VS Code、[Dev Containers拡張](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)を用意します。ホスト側のNode.js・pnpmは不要です。

1. Docker Desktopを起動します。
2. このリポジトリをVS Codeで開き、コマンドパレットから`Dev Containers: Reopen in Container`を実行します。
3. 初回セットアップの完了後、コンテナ内のターミナルで次を実行します。

```bash
pnpm dev --hostname 0.0.0.0
```

`http://localhost:3000`で確認できます。[Dev Containerの公式手順](https://code.visualstudio.com/docs/devcontainers/create-dev-container)に沿って、`.devcontainer/devcontainer.json`から専用Composeを起動します。

コンテナにはNode.js `24.18.0`、`package.json`と同じpnpm、Git、ESLint・Prettier・Prisma・PlaywrightのVS Code拡張を用意します。初回作成時には依存関係の固定インストール、Prisma Clientの生成、開発・テストDBへのマイグレーション、Chromiumと[PlaywrightのOS依存パッケージ](https://playwright.dev/docs/browsers#install-system-dependencies)のインストールを自動実行します。セットアップに失敗した場合はログを確認して、コンテナ内で`bash .devcontainer/post-create.sh`を再実行できます。

MySQL `8.4.10`はコンテナ内の`mysql:3306`で利用し、開発用`jhs_dev`とテスト用`jhs_test`を分けています。DB接続情報は専用Composeが設定するため、`.env.local`のホスト用DB設定を書き換える必要はありません。ここで使うパスワードは開発専用の固定値です。MySQLのポートはホストへ公開しません。本番Compose・Cloudflare Tunnel・本番のsecretは使用しません。

Discordなどの公開URLや管理画面の開発バイパスを設定したい場合は、既存の`.env.local`を使用します。ファイルがない場合にだけ`cp .env.example .env.local`で作成し、必要な項目を編集してください。管理画面のバイパス設定は後述の「ローカル管理画面開発」を参照してください。

品質チェックは通常の`pnpm typecheck`、`pnpm lint`、`pnpm format:check`、`pnpm test`、`pnpm build`を使用します。DB統合テストと管理画面のE2Eは、コンテナ内でテストDBを指定します。

```bash
DATABASE_NAME=jhs_test RUN_DATABASE_INTEGRATION=true pnpm test:integration
DATABASE_NAME=jhs_test E2E_ADMIN_ENABLED=true pnpm test:e2e --workers=1
```

アプリの3000番、E2Eサーバーの3100番、Playwrightレポートの9323番をVS Code経由で転送します。`node_modules`、`.next`、pnpmストア、ブラウザー、MySQLデータは専用の名前付きvolumeに保存し、ホストのWindows用依存関係と分けます。

Node.js・pnpmのバージョンやDockerfileを変更した場合は`Dev Containers: Rebuild Container`を実行してください。RebuildやVS Code終了時のコンテナ停止ではDBデータは保持されます。新しいマイグレーションを追加・取得した場合は`pnpm db:migrate:deploy`と`DATABASE_NAME=jhs_test pnpm db:migrate:deploy`で両DBへ適用します。

### ホストのNode.jsで開発する

```powershell
corepack enable
pnpm install --frozen-lockfile
Copy-Item .env.example .env.local
pnpm dev
```

ブラウザで`http://localhost:3000`を開きます。PowerShellの実行ポリシーによって`pnpm.ps1`が実行できない場合は、`pnpm.cmd`を使用してください。

Tailscale経由の開発確認では`http://10.96.0.36:3000`を使用できます。開発用JS、CSS、Fast Refreshへのアクセスは`next.config.ts`の`allowedDevOrigins`でこのIPだけを許可しています。IPを変更した場合は許可リストも更新し、開発サーバーを再起動してください。ワイルドカードや信頼していないホストは追加しません。

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

Docker Composeではプロジェクト直下の`.env`を使用します。GHCR向けGitHub ActionsではRepository Variablesの`NEXT_PUBLIC_DISCORD_INVITE_URL`を優先し、未設定時は現在の公式Discord招待URLを使用します。

### Rust接続先の設定

URLやF1コマンド全体ではなく、ホスト名と必要に応じてポートだけを設定します。

```env
NEXT_PUBLIC_RUST_SERVER_ADDRESS=play.jhs.nekonection.com
```

設定するとHero下部の接続欄へ次の操作が表示されます。

- F1コンソール用の`client.connect play.jhs.nekonection.com`をコピー
- `steam://run/252490//+connect ...`形式のリンクからSteamとRustを起動

## コンテンツの更新

見出しや案内文などの静的な文章は次の2ファイルで管理しています。

- `src/content/ja.ts`: 日本語
- `src/content/en.ts`: 英語

Heroの主見出しは`hero.headline`の2行、短い説明は`hero.description`から編集できます。正式なサーバー名の表記は`hero.title`、設定の要約は`server.settings`で管理します。

レイド時間の数値は`src/content/server.ts`の`raidWindows`で管理します。日本語・英語の設定一覧と日時確認ツールが同じデータを使います。時刻を変更する場合は、管理画面のルール本文やFAQの案内も合わせて更新してください。日時確認ツールの判定もこのデータを使います（開始時刻を含み、終了時刻を含みません）。レイド時間の判定は`src/lib/raid-schedule.ts`、現地日時からUTCへの変換は`src/lib/zoned-date-time.ts`、日時確認の文言は日英それぞれの`server.schedule`、ワイプ・タイムゾーンの文言は`server.schedule.live`で管理します。時間帯の変更時は0時・週末・夏時間の境界を含むテストも確認してください。

ワイプの予定は同じ`src/content/server.ts`の`wipeSchedule`（`weekday: 5`は金曜、`hour: 18`はJST）で管理し、`src/lib/wipe-schedule.ts`で次回時刻と残り時間を計算します。曜日を変える場合は日英の`server.settings`のワイプ曜日と規約も合わせて更新してください。ライブ表示のラベルは`server.schedule.live`から編集できます。

静的な項目を追加・削除する場合は両言語で同じ`id`を使用し、必要に応じて`src/content/types.ts`のID一覧と型も更新してください。日英でIDが一致しない場合、表示時に`Localized content item is missing`エラーになります。お知らせ、FAQ、VIP、モデレーター募集、サーバールールの本文はTypeScriptではなく管理画面から更新します。

### お知らせの追加

お知らせはTypeScriptへ直接追加せず、Cloudflare Accessで保護された`/admin/news`から管理します。下書きでは英語を省略できますが、公開または予約公開には日本語・英語の両方が必要です。

- `下書き`: 公開サイトには表示されず、管理画面内だけでプレビューできます。
- `公開`: 公開日時が現在以前なら公開サイトへ表示されます。
- `予約公開`: 公開状態のまま未来の公開日時を指定します。日時は日本時間（JST）で入力し、DBにはUTCで保存します。
- `アーカイブ`: 公開対象から外します。お知らせと操作ログは削除しません。

公開サイトは公開日時が新しい順に1ページ5件を表示します。PCでは左に見出し、右に日付・カテゴリ・タイトル・矢印を揃えた一覧を表示します。スマートフォンでは日付とカテゴリをタイトルの上に配置し、各行をクリックすると`/news/[id]`の専用ページへ移動し、本文・関連リンクを広く表示します。詳細ページは日本語・英語、ライト・ダークテーマに対応し、元のお知らせ一覧へ戻れます。JavaScriptなしでも通常のリンクで移動できます。下書き・公開予定時刻前・アーカイブ済みのお知らせは詳細ページでも404になります。6件以上ある場合は「過去のお知らせを見る」から同じLP内で5件ずつページ送りできます。予約時刻の到来は最大約60秒のキャッシュ遅延が生じる場合があります。管理画面からの保存時は公開キャッシュを即時無効化します。

### FAQの更新

FAQはCloudflare Accessで保護された`/admin/faqs`から管理します。日本語の質問と回答は常に必須で、公開時は英語も必須です。

- `下書き`: 公開サイトには表示されません。英語は省略できます。
- `公開`: 日英の質問と回答を公開サイトへ表示します。
- `表示順`: 0から9999までの整数を指定し、数字が小さいFAQから表示します。
- `確認済み / 準備中`: 回答内容の確認状態です。準備中の場合は公開サイトにも状態を表示します。
- `アーカイブ`: 公開対象から外します。FAQと操作ログは削除しません。

既存のFAQはマイグレーションでDBへ移行されます。公開FAQは最大約60秒キャッシュされますが、管理画面からの保存時はFAQキャッシュを即時無効化します。

### FAQ・お知らせのMarkdown

管理画面のFAQ「回答 / Answer」とお知らせ「概要 / Description」はMarkdownで編集できます。入力したEnterはそのまま改行され、空行で段落が分かれます。既存の文章も再保存せずに改行が反映されます。日本語・英語の両方に対応し、お知らせの管理者プレビューも公開サイトと同じ描画を使います。質問・タイトルは通常のテキストです。

```md
# 参加前の確認

1行目の案内です。
次の行にも案内を書けます。

**重要な案内**と*補足*、~~古い案内~~、`client.connect`。

- Discordでルールを確認
- チーム人数を確認

[ルールへ移動](#rules)

> 補足の案内
```

番号付きリスト、コードブロック、Markdownの表も使えます。表とコードブロックは本文の幅に収め、必要な場合は中だけを横スクロールできます。見出しはFAQ・お知らせの見出し階層に合わせるため、本文に`#`を書いてもページのH1は増えません。

共通の`src/components/ui/MarkdownContent.tsx`が[react-markdown](https://github.com/remarkjs/react-markdown)、[remark-breaks](https://github.com/remarkjs/remark-breaks)、[remark-gfm](https://github.com/remarkjs/remark-gfm)を使ってReact要素へ変換します。HTMLは文字として扱い、実行しません。リンクはHTTP・HTTPS・メール・同一ページのアンカー・サイト内絶対パスに対応し、危険なスキームはリンクにしません。外部リンクは新しいタブで開きます。画像記法は代替テキストを表示します。

保存先のDB構造と文字数制限は従来どおりです（FAQ回答4000文字、お知らせ概要600文字。Markdownの記号も含みます）。追加のマイグレーションは不要です。

### VIPの更新

VIP案内はCloudflare Accessで保護された`/admin/vip`から管理します。セクションの案内文、確認状態、料金・期間・購入情報、最大8件の特典、Tebex購入ボタン、注意事項を日本語と英語で編集できます。

- `確認済み / 準備中`: VIP全体および料金など各項目の確認状態です。
- `VIP特典`: 実際に提供する内容だけを日英セットで登録します。アイコンは管理画面の候補から選択できます。
- `Tebex購入ボタン`: 有効にする場合は日英のラベルと補足文が必須です。リンク先は`NEXT_PUBLIC_TEBEX_URL`を使用します。
- 保存は版番号で競合を検知し、変更前後の内容と操作者を操作ログへ記録します。

既存のVIP案内はマイグレーションでDBへ移行されます。公開内容は最大約60秒キャッシュされますが、管理画面からの保存時は即時無効化します。DBへ接続できない場合は、公開セクションが消えないようTypeScript内の初期内容をフォールバック表示します。

### モデレーター募集の更新

モデレーター募集はCloudflare Accessで保護された`/admin/moderator`から管理します。募集状態、主な活動内容、応募条件、求める人物像、応募方法、応募ボタンを日本語と英語で編集できます。

- `確認済み / 準備中`: 募集全体および各案内項目の確認状態です。
- `応募ボタン`: 有効にする場合は日英のラベルと補足文が必須です。リンク先は`NEXT_PUBLIC_MODERATOR_APPLICATION_URL`を使用します。
- 保存は版番号で競合を検知し、変更前後の内容と操作者を操作ログへ記録します。

既存の募集案内もマイグレーションでDBへ移行されます。公開キャッシュとDB障害時のフォールバックはVIPと同じ方針です。

### 利用規約の更新

利用規約は`ja.ts`と`en.ts`の`terms`で管理しています。フッターの「利用規約」ボタンからモーダルで開きます。条文を変更する場合は、両言語の`articles`と`lastUpdated`を合わせて更新してください。

### サーバールールの更新

サーバールールはCloudflare Accessで保護された`/admin/rules`から管理します。重要事項の要約一覧と、「サーバールール全文を見る」内のルール、例外、違反時の対応を日本語と英語で編集できます。Discordの長文投稿ではなく、Webサイトに掲載する内容を最新版として扱います。

- 要約一覧は既存の6件を編集でき、重要表示と確認状態も変更できます。
- ルール章は最大12件まで追加・削除・並べ替えが可能です。章内の説明文と箇条書きも日英セットで編集できます。
- 日英の章ID、説明文数、箇条書きIDと項目構造が一致しない内容は保存できません。
- 保存は版番号で競合を検知し、変更前後の内容と操作者を操作ログへ記録します。

既存のルールはマイグレーションでDBへ移行されます。公開内容は最大約60秒キャッシュされますが、管理画面からの保存時は即時無効化します。DBへ接続できない場合や保存データが不正な場合は、公開セクションが消えないよう`ja.ts`と`en.ts`の初期内容をフォールバック表示します。

### Hero背景と画像の差し替え

Hero背景は`src/components/ui/HeroRhythm.tsx`のSVGと、`globals.css`の`.hero-rhythm`関連スタイル・`rhythm-*`キーフレームで変更します。画像の読み込みやCanvasは不要です。色は既存のテーマ変数を参照します。空と照明のアニメーションは`.rhythm-cycle`で同期させます。Reduced Motionでは月夜の静止画を表示します。

- `public/icon.png`: ヘッダー、Footerで使用する公式アイコン
- `public/main-image.png`: 以前のHero画像（現在のLPでは未使用）
- `public/banner.png`: Discordなどのリンク共有で使用するOG/Twitter画像

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

MySQL統合テストはマイグレーション済みのテストDBに対して実行します。`RUN_DATABASE_INTEGRATION=true`を指定しない通常のUnit Testでは、DB統合テストをスキップします。CIではMySQL 8.4.10を起動し、マイグレーション適用後にお知らせ、FAQ、VIP、モデレーター募集、サーバールールの統合テストを自動実行します。

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

`migrate`が終了コード0で完了してから`web`が起動します。Docker Composeで本番イメージをビルドする場合は`NEXT_PUBLIC_SITE_URL`と`NEXT_PUBLIC_DISCORD_INVITE_URL`を設定し、HTTPSの公開URLであることを検証します。GHCR向けContainerワークフローでは、Repository Variablesが未設定の場合に既定値を使用します。

ログは次のコマンドで確認できます。

```powershell
docker compose logs migrate
docker compose logs -f web
```

Next.jsとマイグレーターは非rootユーザーで実行します。MySQLは永続volume`mysql_data`へ保存されます。公開サイトはDB障害時にもページ全体を500にせず、お知らせ欄とFAQ欄へ取得失敗を表示し、VIP、モデレーター募集、サーバールールは初期内容へフォールバックします。管理画面は認証設定が欠けている場合に503で閉じます。

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

お知らせとFAQの作成・更新・アーカイブ、およびVIP、モデレーター募集、サーバールールの更新は、それぞれの操作ログと同じMySQLトランザクションで保存します。操作ログの保存に失敗した場合、コンテンツ変更もロールバックされます。`/admin/audit`では最新100件の操作者、操作、対象種別とID、変更前後を参照できますが、編集・削除機能は提供しません。

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
public/           # 公式アイコンと共有用バナーなど
```

## フォントライセンス

英数字はGeist、日本語はNoto Sans JPの可変フォントを使います。Geistは`next/font/local`、Noto Sans JPは`next/font/google`で自己配信します。日本語はUnicode範囲ごとのファイルを必要に応じて読み込み、一括プリロードはしません。いずれも`font-display: swap`を使用します。

Noto Sans JPはビルド時にGoogle Fontsへ接続します。閲覧時は同じサイトの静的ファイルから配信され、ブラウザーからGoogleへのリクエストは発生しません（[Next.jsのフォント最適化](https://nextjs.org/docs/app/getting-started/fonts)）。初回のビルド環境ではGoogle Fontsへのネットワークアクセスが必要です。

両フォントのライセンスはSIL Open Font License 1.1です。本文は`src/app/fonts/OFL.txt`と`src/app/fonts/NotoSansJP-OFL.txt`に含まれています。
