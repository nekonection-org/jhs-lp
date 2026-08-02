# AGENTS.md

## 1. プロジェクト概要

このプロジェクトでは、Rustコミュニティサーバー **Japan Hideaway Server** の公式ランディングページを開発する。

サイトは複数ページへ遷移する構成ではなく、すべての情報を1ページ内に配置する**シングルページ型LP**とする。

ヘッダーのナビゲーションを押すと、同一ページ内の対応セクションへスムーズスクロールする。

### 主な目的

- Japan Hideaway Serverの特徴を分かりやすく伝える
- サーバールールを確認しやすくする
- VIP制度を案内する
- よくある質問へ回答する
- モデレーター募集を案内する
- サーバーのお知らせを掲載する
- Discordへの参加を促す
- 日本語と英語の両方に対応する
- ダークモードとライトモードを提供する

---

## 2. 基本方針

このサイトでは、以下を重視する。

1. シンプルで分かりやすいこと
2. 情報を探しやすいこと
3. スマートフォンでも快適に閲覧できること
4. 過度なアニメーションを使用しないこと
5. 生成AIで作られたような過剰な装飾を避けること
6. 将来的な情報更新が容易であること
7. アクセシビリティとパフォーマンスを損なわないこと

デザインは、ゲームサーバーらしさを残しつつ、一般的なサービスサイトとして違和感のない、落ち着いたミニマルデザインにする。

---

## 3. 技術スタック

### Core

- Next.js 16
- React 19
- TypeScript
- App Router
- Node.js 24
- pnpm

### Styling

- Tailwind CSS v4
- CSS Variables
- `clsx`
- `tailwind-merge`

### Animation

- Motion for React

```bash
pnpm add motion
```

### Theme

- `next-themes`

```bash
pnpm add next-themes
```

### Icons

- `lucide-react`

```bash
pnpm add lucide-react
```

### Testing

- Vitest
- React Testing Library
- Playwright

### Code Quality

- ESLint
- Prettier
- TypeScript strict mode

### Infrastructure

- Docker
- Docker Compose
- GitHub Actions
- Cloudflare
- nginxまたはCloudflare Tunnel

---

## 4. 使用しない技術

初期実装では、以下を使用しない。

- React Three Fiber
- Three.js
- GSAP
- WebGL
- Canvasベースの背景演出
- 大規模なUIコンポーネントライブラリ
- データベース
- Redis
- RustサーバーへのRCON接続
- サーバーステータス取得処理
- CMS
- 過度なパララックス演出

shadcn/uiも原則として導入しない。

必要なUIはTailwind CSSとReactで実装する。FAQには、可能な限りネイティブの `details` と `summary` を利用する。

---

## 5. サイト構成

サイトは `/` の1ページのみを基本とする。

各コンテンツは同一ページ内のセクションとして実装する。

```text
/
├── Header
├── Hero
├── Server Information
├── Rules
├── VIP
├── FAQ
├── Moderator Recruitment
├── News
├── Final CTA
└── Footer
```

別ページへの遷移は原則として実装しない。

外部サービスへ移動する場合のみ、外部リンクを使用してよい。

例:

- Discord招待URL
- TebexのVIP購入ページ
- Xの公式アカウント
- Steam接続リンク

---

## 6. セクションID

各セクションには以下のIDを設定する。

```text
#top
#server
#rules
#vip
#faq
#moderator
#news
```

ナビゲーションからクリックした場合、対応するセクションへスムーズスクロールする。

```tsx
<a href="#rules">ルール</a>
```

JavaScriptに依存しなくてもアンカー移動できる構造を維持する。

CSSで以下を設定する。

```css
html {
  scroll-behavior: smooth;
}
```

固定ヘッダーによって見出しが隠れないよう、各セクションへ `scroll-margin-top` を指定する。

```css
section {
  scroll-margin-top: 6rem;
}
```

---

## 7. ヘッダー

ヘッダーは画面上部へ固定する。

```text
Logo / Server Name
サーバー情報
ルール
VIP
FAQ
モデレーター募集
お知らせ
JP / EN
Theme Toggle
Discordに参加
```

### ヘッダー要件

- `position: sticky`
- `top: 0`
- 適切な `z-index`
- 半透明背景
- 背景ぼかしは控えめにする
- スクロール後も文字が読めること
- モバイルではハンバーガーメニューに変更する
- キーボードで操作できること
- Escキーでモバイルメニューを閉じられること
- メニュー表示中は適切にフォーカスを管理すること

### アクティブセクション

現在表示されているセクションに対応するナビゲーション項目を強調してよい。

実装には `IntersectionObserver` を使用する。

常時スクロールイベントで位置を計算する実装は避ける。

アクティブ表示は控えめにする。

- 下線
- テキスト色の変更
- 小さなアクセント
- 背景色のわずかな変化

派手なタブ表現にはしない。

---

## 8. Heroセクション

Heroでは以下を表示する。

### 必須情報

- Japan Hideaway Server
- 社会人・学生向けのRustコミュニティサーバー
- 短い紹介文
- Discord参加ボタン
- ルールへスクロールするボタン

### 文面の仮案

```text
Japan Hideaway Server

社会人・学生向けのRustコミュニティサーバー

限られた時間でもしっかり遊べるよう、
レイド可能時間を設定したコミュニティサーバーです。
```

### CTA

Primary:

```text
Discordに参加
```

Secondary:

```text
ルールを見る
```

「ルールを見る」は `#rules` へ移動する。

### 背景

Heroのみ、Rustの世界観を感じさせる背景画像を使用してよい。

ただし以下を守る。

- 背景画像を主役にしない
- 文字の可読性を最優先する
- 強いオレンジ色や炎の演出を多用しない
- キャラクターを大きく配置しない
- 著作権上利用できない画像を追加しない
- 必ず暗いオーバーレイを適用する
- モバイルでは画像の表示位置を調整する
- 画像なしでもレイアウトが成立するようにする

---

## 9. サーバー情報セクション

ID:

```text
#server
```

Japan Hideaway Serverの基本情報と特徴を掲載する。

### 掲載候補

- 最大4人チーム
- 毎週金曜日18:00ワイプ
- 社会人・学生向け
- レイド可能時間あり
- 公式仕様に近いゲームバランス
- コミュニティサーバー
- Discordによるサポート
- 定期的なルール・設定の見直し

情報はカードまたは整列したリストで表示する。

カード数が多くなりすぎないようにする。

デスクトップでは3列または4列、モバイルでは1列または2列にする。

---

## 10. ルールセクション

ID:

```text
#rules
```

LPではルール全文を長文で掲載するのではなく、特に重要なルールを整理して掲載する。

### 掲載候補

- レイド可能時間
- チーム人数上限
- チート・グリッチ・不正ツールの禁止
- 暴言・差別・過度な煽りの禁止
- サーバー運営や個人への過度な攻撃の禁止
- ルール違反時の対応
- F7レポートの案内
- ルールが変更される場合があること

### 表示方法

- 短い見出し
- 1〜3行程度の説明
- アイコンは補助的に使用
- 長い規約のような表示にしない
- 重要な時間や数値は視認性を高くする

例:

```text
レイド可能時間

平日は18:00から24:00までレイドできます。
時間外の建築物破壊はルール違反となる場合があります。
```

実際のルール内容は、プロジェクト内のコンテンツファイルから編集できるようにする。

---

## 11. VIPセクション

ID:

```text
#vip
```

VIP制度の目的、特典、購入方法を掲載する。

### 注意事項

VIP特典は実際に提供している内容だけを掲載する。

未実装の特典を、実装済みのように表示してはいけない。

VIPがゲームバランスを著しく壊すような表現を避ける。

### 掲載内容

- VIP制度の説明
- 主な特典
- 料金
- 有効期間
- 購入方法
- Discordロールについて
- 注意事項
- Tebexへの外部リンク

VIP情報は後から変更しやすいデータ構造にする。

```ts
type VipBenefit = {
  title: string;
  description: string;
  icon?: string;
};
```

VIP購入ボタンは外部リンクであることが分かるようにする。

外部リンクには必要に応じて以下を指定する。

```tsx
target="_blank"
rel="noopener noreferrer"
```

---

## 12. FAQセクション

ID:

```text
#faq
```

FAQはアコーディオン形式で表示する。

可能な限り、ネイティブHTMLを利用する。

```tsx
<details>
  <summary>サーバーへの参加方法を教えてください。</summary>
  <p>Discordへ参加し、サーバー情報をご確認ください。</p>
</details>
```

### FAQ候補

- サーバーへの参加方法
- 初心者でも参加できるか
- ワイプ日時
- チーム人数
- レイド可能時間
- ルール違反の報告方法
- BANに関する問い合わせ方法
- VIPの購入方法
- Discordへの参加方法
- 日本語以外への対応

### 要件

- キーボードで操作可能
- 開閉状態が分かる
- 十分なクリック領域を確保する
- アイコンだけに依存しない
- 開閉アニメーションは控えめにする
- `prefers-reduced-motion` に対応する

---

## 13. モデレーター募集セクション

ID:

```text
#moderator
```

サーバー運営を支援するモデレーターの募集内容を掲載する。

### 掲載内容

- 募集目的
- 主な活動内容
- 応募条件
- 求める人物像
- 応募方法
- Discordへのリンク

### 文面の方向性

モデレーターは権限を持つ役職であるため、軽いノリだけで募集しない。

責任、公平性、継続性を重視する。

例:

```text
サーバーを一緒に支えてくれるモデレーターを募集しています。

プレイヤー対応やルール違反の確認など、
コミュニティをより良くするための運営活動を担当します。
```

応募ボタンはDiscordの応募チャンネルまたは応募フォームへ接続する。

---

## 14. お知らせセクション

ID:

```text
#news
```

最新のお知らせを3件から5件程度表示する。

### 掲載内容

- 日付
- カテゴリ
- タイトル
- 短い概要

### カテゴリ例

- お知らせ
- メンテナンス
- アップデート
- イベント
- 重要
- 障害情報

### 初期実装

CMSやデータベースは使用しない。

TypeScriptのコンテンツファイルから読み込む。

```ts
export type NewsItem = {
  id: string;
  publishedAt: string;
  category: "notice" | "maintenance" | "update" | "event" | "important";
  title: string;
  description: string;
  url?: string;
};
```

お知らせをクリックして別ページへ移動する機能は、初期実装では不要。

必要な場合はカード内で詳細を展開するか、Discordの該当投稿へ外部リンクする。

架空のお知らせを本番環境へ掲載しない。

---

## 15. 最終CTA

Footerの直前に、Discord参加を促すCTAを配置する。

例:

```text
Japan Hideaway Serverに参加しよう

最新情報やサポートはDiscordでご案内しています。
```

ボタン:

```text
Discordに参加
```

Heroと同じリンクを利用する。

---

## 16. ダークモード・ライトモード

### 初期値

初期表示は必ずダークモードにする。

システム設定を初期値には使用しない。

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="dark"
  enableSystem={false}
>
  {children}
</ThemeProvider>
```

### ユーザー設定

ユーザーがテーマを変更した場合は、選択結果を保存する。

`next-themes` の標準的な永続化を利用する。

### HTML

Hydration mismatchを避けるため、必要に応じて以下を設定する。

```tsx
<html lang="ja" suppressHydrationWarning>
```

### テーマ切替ボタン

- 月と太陽のアイコンを使用してよい
- `aria-label` を設定する
- 現在のテーマが分かること
- 色だけで状態を表現しない
- 初回レンダリング時のちらつきを避ける
- マウント前のテーマ依存UI表示に注意する

---

## 17. 日本語・英語対応

### 基本方針

言語切替はページ遷移を発生させない。

URLを `/ja` や `/en` に分割せず、同一ページ内で表示言語を切り替える。

初期言語は日本語とする。

ユーザーが選択した言語は `localStorage` に保存する。

### 対応言語

```ts
type Locale = "ja" | "en";
```

### コンテンツ構造

テキストをReactコンポーネントへ直接大量に記述しない。

```text
src/
└── content/
    ├── ja.ts
    ├── en.ts
    ├── types.ts
    └── index.ts
```

例:

```ts
export const ja = {
  navigation: {
    server: "サーバー情報",
    rules: "ルール",
    vip: "VIP",
    faq: "FAQ",
    moderator: "モデレーター募集",
    news: "お知らせ",
  },
};
```

英語コンテンツが準備できていない箇所は、日本語をそのまま表示するのではなく、開発中であることが分かるデータを設定する。

### HTMLのlang属性

言語切替時に、ドキュメントの `lang` 属性も変更する。

```ts
document.documentElement.lang = locale;
```

### 言語切替UI

```text
JP / EN
```

現在選択されている言語を明確に表示する。

国旗アイコンは使用しない。

言語と国は同一ではないため、テキスト表記を優先する。

---

## 18. デザインシステム

### デザイン方針

- ミニマル
- 落ち着いたゲーム系デザイン
- 高い可読性
- 過剰なグローを避ける
- 過剰なガラス表現を避ける
- 余白を十分に取る
- 緑をアクセントとして限定的に使用する

### ダークテーマ例

```css
--background: #090c0a;
--surface: #101411;
--surface-secondary: #151a16;
--border: #293029;
--text-primary: #f3f5f3;
--text-secondary: #a7afa8;
--accent: #8fbd78;
--accent-hover: #a2cf8c;
--danger: #d87878;
```

### ライトテーマ例

```css
--background: #f4f6f3;
--surface: #ffffff;
--surface-secondary: #edf1ec;
--border: #d8ddd7;
--text-primary: #172019;
--text-secondary: #59635b;
--accent: #527d43;
--accent-hover: #426b35;
--danger: #b84f4f;
```

色はTailwindまたはCSS Variablesから参照する。

同じ意味の色をコンポーネント内へ直接ハードコードしない。

### 角丸

過度に丸いデザインは避ける。

目安:

```text
カード: 12px前後
ボタン: 8pxから10px
小さなタグ: 6pxから8px
```

全面的なピル型UIにはしない。

### 影

影は控えめにする。

強い黒いドロップシャドウや、ネオンのようなグローを常用しない。

---

## 19. レスポンシブ対応

以下を必ず確認する。

- 360px
- 375px
- 390px
- 768px
- 1024px
- 1280px
- 1440px以上

### モバイル要件

- 横スクロールを発生させない
- ヘッダーはモバイルメニューへ変更
- CTAを押しやすいサイズにする
- 文字サイズを小さくしすぎない
- カードは基本1列
- 必要に応じて2列
- Heroの高さを過度に大きくしない
- ナビゲーションを画面外へはみ出させない

### 最大幅

主要コンテンツは中央寄せにする。

```text
max-width: 1200px前後
```

超大型ディスプレイでコンテンツが横へ広がりすぎないようにする。

---

## 20. アニメーション

アニメーションはMotion for Reactを使用する。

### 使用してよい演出

- Heroの軽いフェードイン
- セクションの軽いフェードイン
- 8pxから20px程度の上下移動
- ボタンのホバー
- カードのわずかな浮き上がり
- モバイルメニューの開閉
- FAQの控えめな開閉
- ナビゲーションのアクティブ表示

### 使用しない演出

- 大きなパララックス
- マウスカーソル追従
- 文字を1文字ずつ表示
- 常時動き続ける背景
- 大量のパーティクル
- 3D回転
- ページ全体のスクロールジャック
- 独自スクロールバー
- スクロール操作を妨げるアニメーション
- 長すぎるトランジション

### 時間の目安

```text
短い操作: 100ms〜200ms
通常の表示: 200ms〜400ms
Hero初期表示: 最大700ms程度
```

### Reduced Motion

`prefers-reduced-motion` を必ず尊重する。

Motion for Reactの `useReducedMotion` またはCSSを利用する。

アニメーションを無効化しても情報が欠落しないようにする。

---

## 21. コンポーネント設計

想定構成:

```text
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── manifest.ts
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── MobileNavigation.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx
│   │   ├── ServerSection.tsx
│   │   ├── RulesSection.tsx
│   │   ├── VipSection.tsx
│   │   ├── FaqSection.tsx
│   │   ├── ModeratorSection.tsx
│   │   ├── NewsSection.tsx
│   │   └── FinalCtaSection.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── SectionHeading.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── LanguageToggle.tsx
│   │   └── Container.tsx
│   └── providers/
│       ├── ThemeProvider.tsx
│       └── LanguageProvider.tsx
├── content/
│   ├── types.ts
│   ├── ja.ts
│   ├── en.ts
│   └── index.ts
├── hooks/
│   ├── useActiveSection.ts
│   └── useMounted.ts
├── lib/
│   ├── cn.ts
│   └── constants.ts
├── public/
│   ├── images/
│   └── icons/
└── tests/
```

コンポーネントの分割を細かくしすぎない。

1回しか使用しない数行の表示を、無理に別コンポーネントへ分割しない。

---

## 22. Server ComponentsとClient Components

App Routerでは、Server Componentsをデフォルトとする。

`"use client"` は必要なコンポーネントにのみ指定する。

Client Componentが必要な例:

- ThemeToggle
- LanguageToggle
- MobileNavigation
- Active navigation
- Motionを使用する一部コンポーネント

ページ全体をClient Componentにしない。

コンテンツ表示のみのセクションは可能な限りServer Componentとして扱う。

LanguageProviderの都合で全体がClient Componentになる設計は避ける。

必要に応じて、言語依存部分だけを小さなClient Componentに分離する。

ただし、複雑化しすぎる場合は保守性を優先する。

---

## 23. コンテンツ管理

すべての主要コンテンツは `src/content` 配下で管理する。

ページコンポーネント内へ文章を散在させない。

### 型定義例

```ts
export type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

export type RuleItem = {
  title: string;
  description: string;
  important?: boolean;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type NewsItem = {
  id: string;
  publishedAt: string;
  category: string;
  title: string;
  description: string;
  url?: string;
};
```

コンテンツを変更するだけで表示が更新される構造にする。

---

## 24. アクセシビリティ

以下を必須とする。

- セマンティックHTML
- 見出し順序を守る
- `h1` はページ内に1つ
- ナビゲーションには `nav`
- メインコンテンツには `main`
- フッターには `footer`
- ボタンとリンクを用途で使い分ける
- キーボード操作に対応
- フォーカスリングを消さない
- 十分な色コントラスト
- 画像に適切な代替テキスト
- 装飾画像は空のalt
- アイコンだけのボタンに `aria-label`
- FAQの状態が支援技術へ伝わること
- モバイルメニューの状態が支援技術へ伝わること
- Reduced Motion対応

装飾目的で `div` をボタンとして使用しない。

---

## 25. SEO

### Metadata

以下を設定する。

- title
- description
- Open Graph
- Twitter Card
- canonical
- favicon
- manifest
- robots.txt
- sitemap.xml

タイトル例:

```text
Japan Hideaway Server | Rustコミュニティサーバー
```

説明例:

```text
社会人・学生向けのRustコミュニティサーバー、Japan Hideaway Serverの公式サイトです。サーバー情報、ルール、VIP、FAQ、運営募集、最新のお知らせをご案内します。
```

### 構造化データ

必要に応じて以下を検討する。

- Organization
- WebSite
- FAQPage

存在しない会社や法人として構造化データを設定しない。

非公式のコミュニティサーバーであることを偽らない。

---

## 26. パフォーマンス

### 目標

- Lighthouse Performance 90以上
- Accessibility 95以上
- Best Practices 95以上
- SEO 95以上

測定環境による差があるため、数値だけを目的に不自然な実装をしない。

### 要件

- Hero画像はNext.js Imageを使用
- 適切な画像サイズを用意
- WebPまたはAVIFを優先
- 不要なJavaScriptを増やさない
- Client Componentを最小限にする
- 初期表示で不要なコンポーネントを読み込まない
- 外部フォントの読み込みを最小限にする
- `next/font` を使用
- レイアウトシフトを避ける
- アイコンライブラリから不要なアイコンをまとめてimportしない

---

## 27. フォント

日本語と英語の両方で読みやすいフォントを使用する。

候補:

- Noto Sans JP
- Inter
- Geist
- BIZ UDPGothic

基本構成例:

```text
英数字: GeistまたはInter
日本語: Noto Sans JP
```

フォント数を増やしすぎない。

見出し用と本文用で極端に異なる書体を使用しない。

---

## 28. コーディング規約

### TypeScript

- `strict: true`
- 原則として `any` を使用しない
- 型アサーションを乱用しない
- データ構造には明示的な型を定義する
- nullとundefinedの扱いを明確にする
- 外部入力は信用しない

### React

- 関数コンポーネントを使用
- 不要な `useEffect` を避ける
- 派生値をstateへ保存しない
- 不要な `useMemo` と `useCallback` を使用しない
- 配列のkeyにindexを使用しない
- propsのバケツリレーを過度に行わない

### 命名

```text
React Component: PascalCase
Function: camelCase
Constant: camelCaseまたはUPPER_SNAKE_CASE
Type: PascalCase
Section ID: kebab-caseまたは単一の小文字
```

### Import

可能な場合はパスエイリアスを使用する。

```ts
import { Button } from "@/components/ui/Button";
```

---

## 29. ESLint・Prettier

以下のコマンドを用意する。

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier . --write",
    "format:check": "prettier . --check",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

Codexは変更後、最低限以下を実行する。

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

UIやナビゲーションを変更した場合は、可能な限りPlaywrightも実行する。

---

## 30. テスト方針

### Unit Test

以下を優先する。

- 言語切替
- テーマ切替
- コンテンツデータの型
- FAQ表示
- URL定数
- 日付表示関数

### Component Test

- Header
- ThemeToggle
- LanguageToggle
- FAQ
- MobileNavigation

### E2E Test

最低限以下を確認する。

1. トップページが表示される
2. 初期テーマがダークモード
3. ライトモードへ変更できる
4. リロード後もテーマが保持される
5. 初期言語が日本語
6. 英語へ切り替えられる
7. リロード後も言語が保持される
8. ナビゲーションから各セクションへ移動できる
9. モバイルメニューを操作できる
10. FAQを開閉できる
11. Discordリンクが正しい
12. 横スクロールが発生しない

---

## 31. 環境変数

外部URLは環境変数で管理する。

```env
NEXT_PUBLIC_SITE_URL=https://japan-hideaway.example
NEXT_PUBLIC_DISCORD_INVITE_URL=https://discord.gg/example
NEXT_PUBLIC_TEBEX_URL=https://example.tebex.io
NEXT_PUBLIC_X_URL=https://x.com/example
```

`.env.example` を用意する。

秘密情報を `NEXT_PUBLIC_` へ設定しない。

このLPではDiscord Bot Token、RCON Password、API Keyなどを使用しない。

---

## 32. Docker

Production用のマルチステージDockerfileを作成する。

Next.jsのstandalone出力を利用する。

```ts
const nextConfig = {
  output: "standalone",
};
```

### Docker要件

- 非rootユーザーで実行
- 開発依存関係を本番イメージへ含めすぎない
- `.dockerignore` を用意
- ヘルスチェックを検討
- Node.jsのバージョンを固定
- pnpm lockfileを使用
- ビルドの再現性を確保する

公開ポート:

```text
3000
```

---

## 33. CI/CD

GitHub Actionsを使用する。

### Pull Request

以下を実行する。

```text
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
```

### Main Branch

- Dockerイメージをビルド
- コンテナレジストリへpush
- 本番環境へデプロイ
- デプロイ失敗時は既存環境を維持
- 必要に応じてDiscordへ通知

初期段階では、CIの成功前に自動デプロイしない。

---

## 34. セキュリティ

- ユーザー入力をHTMLとして直接描画しない
- `dangerouslySetInnerHTML` を原則使用しない
- 外部リンクには適切な `rel` を設定
- 秘密情報をクライアントへ含めない
- 不要なAPI Routeを作成しない
- RCONへ接続しない
- Discord Botへ直接接続しない
- 管理画面を初期実装へ含めない
- 依存パッケージを増やしすぎない
- 外部スクリプトの読み込みを避ける

---

## 35. 実装順序

以下の順番で進める。

### Phase 1: 初期構築

1. Next.jsプロジェクト作成
2. TypeScript strict設定
3. Tailwind CSS設定
4. ESLint・Prettier設定
5. 基本ディレクトリ作成
6. デザイントークン作成

### Phase 2: 基本レイアウト

1. Root Layout
2. ThemeProvider
3. LanguageProvider
4. Header
5. Footer
6. Container
7. SectionHeading
8. Button

### Phase 3: セクション

1. Hero
2. サーバー情報
3. ルール
4. VIP
5. FAQ
6. モデレーター募集
7. お知らせ
8. 最終CTA

### Phase 4: インタラクション

1. アンカーナビゲーション
2. アクティブセクション表示
3. モバイルメニュー
4. テーマ切替
5. 言語切替
6. FAQ開閉
7. 控えめなアニメーション

### Phase 5: 品質

1. レスポンシブ確認
2. アクセシビリティ確認
3. Lighthouse確認
4. Unit Test
5. E2E Test
6. SEO設定
7. OGP設定

### Phase 6: デプロイ

1. Dockerfile
2. Docker Compose
3. GitHub Actions
4. 本番環境設定
5. Cloudflare設定
6. 動作確認

---

## 36. 禁止事項

以下の実装を行わない。

- サーバーステータス表示
- Online人数表示
- Queue人数表示
- Joining人数表示
- Sleepers人数表示
- RCON接続
- ページ遷移を前提とした構成
- `/rules` や `/vip` などの個別ページ作成
- スクロールジャック
- 過度なパララックス
- 大量のパーティクル
- 3Dモデル
- 動画背景の自動再生
- 意味のないカウントアップ
- 過度なグラデーション
- 過度なネオン表現
- カードを必要以上に増やす
- 架空のVIP特典
- 架空のサーバー実績
- 架空のお知らせ
- 存在しない運営会社の表記
- Rust公式サーバーと誤認させる表現
- Facepunch公式サイトと誤認させるデザイン
- 著作権上利用できない素材の追加

---

## 37. Codexの作業ルール

Codexは以下を守る。

1. 既存仕様を確認してから変更する
2. ユーザーの指示なしに技術スタックを変更しない
3. 新しい依存関係を追加する前に、本当に必要か検討する
4. 大規模なリファクタリングを無断で行わない
5. UIを変更する場合は、モバイル表示も同時に確認する
6. 文言を勝手に事実として追加しない
7. 不明なサーバー情報は仮データとして明示する
8. 秘密情報をソースコードへ記述しない
9. 変更後はLint、型チェック、テスト、ビルドを実行する
10. エラーを無視するための設定変更を行わない
11. TypeScriptエラーを `any` で回避しない
12. ESLintルールを安易に無効化しない
13. アクセシビリティ警告を無視しない
14. 既存のデザインルールを維持する
15. 実装内容とテスト結果を作業完了時に報告する

---

## 38. 完了条件

以下をすべて満たした時点で初期リリース完了とする。

### UI

- 1ページ内にすべてのセクションが存在する
- ナビゲーションから各セクションへ移動できる
- 固定ヘッダーが正常に動作する
- モバイルメニューが正常に動作する
- ダークモードが初期値になっている
- ライトモードへ切り替えられる
- 日本語と英語を切り替えられる
- テーマと言語の選択が保存される
- FAQを開閉できる
- Discord参加ボタンが機能する

### Sections

- Hero
- サーバー情報
- ルール
- VIP
- FAQ
- モデレーター募集
- お知らせ
- 最終CTA
- Footer

### Quality

- TypeScriptエラーがない
- ESLintエラーがない
- Prettierチェックを通過する
- Unit Testを通過する
- Production Buildを通過する
- 主要E2E Testを通過する
- 360px幅で横スクロールがない
- キーボードのみで主要操作が可能
- Reduced Motionに対応している
- 基本的なSEOメタデータが設定されている
- OGP画像が設定されている

### Infrastructure

- Dockerで起動できる
- `.env.example` が存在する
- READMEに起動方法が記載されている
- GitHub Actionsで品質チェックが実行される

---

## 39. 最終的なデザイン判断

迷った場合は、以下の優先順位で判断する。

```text
情報の分かりやすさ
> 操作性
> アクセシビリティ
> パフォーマンス
> 保守性
> アニメーション
> 装飾
```

見た目を豪華にするために、読みやすさや操作性を犠牲にしてはいけない。

Japan Hideaway ServerのLPは、派手なゲーム広告ではなく、サーバーについて安心して確認できる公式案内サイトとして設計する。