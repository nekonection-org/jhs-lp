import type { SiteContent } from "./types";

export const ja = {
  locale: "ja",
  metadata: {
    title: "Japan Hideaway Server | Rustコミュニティサーバー",
    description:
      "社会人・学生向けのRustコミュニティサーバー、Japan Hideaway Serverの公式案内サイトです。サーバー情報、ルール、VIP、FAQ、運営募集、お知らせをご案内します。",
    openGraphImageAlt: "Japan Hideaway Server 公式案内サイト",
  },
  common: {
    siteName: "Japan Hideaway Server",
    skipToContent: "本文へ移動",
    joinDiscord: "Discordに参加",
    externalLink: "外部リンク",
    opensInNewTab: "新しいタブで開きます",
    learnMore: "詳しく見る",
    backToTop: "ページ上部へ戻る",
    unavailable: "現在利用できません",
    pendingConfirmation: "運営確認中",
    statusLabels: {
      confirmed: "確認済み",
      pending: "運営確認中",
    },
  },
  theme: {
    label: "表示テーマ",
    dark: "ダーク",
    light: "ライト",
    currentTheme: "現在のテーマ",
    switchToDark: "ダークテーマに切り替える",
    switchToLight: "ライトテーマに切り替える",
  },
  language: {
    label: "表示言語",
    japanese: "日本語",
    english: "英語",
    currentLanguage: "現在の言語",
    switchToJapanese: "日本語に切り替える",
    switchToEnglish: "英語に切り替える",
  },
  navigation: {
    ariaLabel: "メインナビゲーション",
    homeLabel: "Japan Hideaway Serverのトップへ移動",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    mobileMenuLabel: "モバイルナビゲーション",
    items: [
      { id: "server", label: "サーバー情報" },
      { id: "rules", label: "ルール" },
      { id: "vip", label: "VIP" },
      { id: "faq", label: "FAQ" },
      { id: "moderator", label: "モデレーター募集" },
      { id: "news", label: "お知らせ" },
    ],
    discordAction: {
      id: "header-discord",
      label: "Discordに参加",
      ariaLabel: "Japan Hideaway ServerのDiscordに参加する",
      destination: "discord",
    },
  },
  hero: {
    id: "top",
    eyebrow: "Rust Community Server",
    title: "Japan Hideaway Server",
    subtitle: "社会人・学生向けのRustコミュニティサーバー",
    description:
      "限られた時間でもしっかり遊べるよう、レイド可能時間を設けたコミュニティサーバーです。具体的な開催時間や参加条件は、確定した情報から順次ご案内します。",
    primaryAction: {
      id: "hero-discord",
      label: "Discordに参加",
      ariaLabel: "Japan Hideaway ServerのDiscordに参加する",
      destination: "discord",
    },
    secondaryAction: {
      id: "hero-rules",
      label: "ルールを見る",
      ariaLabel: "重要なサーバールールを見る",
      destination: "rules",
    },
    backgroundAlt: "",
  },
  server: {
    id: "server",
    eyebrow: "Server Information",
    title: "サーバー情報",
    description:
      "Japan Hideaway Serverの基本方針と、参加前に知っておきたい情報をご案内します。",
    items: [
      {
        id: "audience",
        title: "社会人・学生向け",
        description:
          "限られたプレイ時間でも参加しやすいコミュニティを目指しています。",
        icon: "users",
        status: "confirmed",
      },
      {
        id: "community",
        title: "コミュニティサーバー",
        description:
          "プレイヤー同士が安心して遊べる環境づくりを大切にするRustコミュニティサーバーです。",
        icon: "community",
        status: "confirmed",
      },
      {
        id: "raid-window",
        title: "レイド可能時間あり",
        description:
          "生活リズムに配慮したレイド可能時間を設けます。具体的な曜日と時刻は運営確認中です。",
        icon: "clock",
        status: "pending",
      },
      {
        id: "operations",
        title: "運営情報を確認中",
        description:
          "チーム人数上限、ワイプ日時、ゲーム設定などの具体値は、確定後に掲載します。",
        icon: "settings",
        status: "pending",
      },
    ],
    pendingNotice:
      "具体的な数値や日時は運営確認中です。未確定情報を確定事項として掲載しません。",
  },
  rules: {
    id: "rules",
    eyebrow: "Rules",
    title: "重要なルール",
    description:
      "参加者が安心して遊べるよう、LPでは特に重要な項目を簡潔にご案内します。",
    noticeTitle: "ルール文面を確認中です",
    notice:
      "以下は掲載予定の項目です。具体的な時間、数値、違反時の対応を含む正式な内容は、運営確認が完了するまで確定ルールとして扱わないでください。",
    items: [
      {
        id: "raid-window",
        title: "レイド可能時間",
        description:
          "レイドを行える曜日と時刻、時間外の扱いについて、正式なルールを確認中です。",
        icon: "clock",
        status: "pending",
        important: true,
      },
      {
        id: "team-size",
        title: "チーム人数上限",
        description:
          "チームに参加できる人数と、同盟・協力行為の扱いを運営確認中です。",
        icon: "users",
        status: "pending",
        important: true,
      },
      {
        id: "fair-play",
        title: "不正行為への対応",
        description:
          "チート、グリッチ、不正ツールなどの禁止範囲と対応方針を確認中です。",
        icon: "shield",
        status: "pending",
      },
      {
        id: "community-conduct",
        title: "コミュニティでの振る舞い",
        description:
          "暴言、差別、過度な煽りや攻撃的な行為に関する基準を確認中です。",
        icon: "message",
        status: "pending",
      },
      {
        id: "reporting",
        title: "違反の報告方法",
        description:
          "F7レポートを含む報告手順と、提出が必要な情報を運営確認中です。",
        icon: "report",
        status: "pending",
      },
      {
        id: "rule-updates",
        title: "ルールの更新",
        description:
          "ルール変更時の告知方法と適用時期を確認中です。公開後も最新の案内をご確認ください。",
        icon: "refresh",
        status: "pending",
      },
    ],
  },
  vip: {
    id: "vip",
    eyebrow: "VIP",
    title: "VIP制度",
    description:
      "VIP制度の目的、実際に提供する特典、料金、購入方法を正確に案内するための準備を進めています。",
    status: "pending",
    statusTitle: "VIP情報は運営確認中です",
    statusDescription:
      "提供内容が確定するまで、特典や料金を実装済みの情報として掲載しません。",
    details: [
      {
        id: "price",
        label: "料金",
        value: "未確定",
        status: "pending",
      },
      {
        id: "duration",
        label: "有効期間",
        value: "未確定",
        status: "pending",
      },
      {
        id: "purchase-method",
        label: "購入方法",
        value: "未確定",
        status: "pending",
      },
      {
        id: "discord-role",
        label: "Discordロール",
        value: "未確定",
        status: "pending",
      },
    ],
    benefitsTitle: "VIP特典",
    benefits: [],
    emptyBenefitsTitle: "確認済みの特典はまだ掲載されていません",
    emptyBenefitsDescription:
      "実際に提供することが確認できた特典だけを、確定後に追加します。",
    purchaseAction: null,
    purchaseUnavailableMessage:
      "購入ページは、提供内容と正式なTebex URLの確認後にご案内します。",
    notice:
      "未実装の特典やゲームバランスを大きく変える内容を、提供中であるかのように掲載しません。",
  },
  faq: {
    id: "faq",
    eyebrow: "FAQ",
    title: "よくある質問",
    description:
      "参加前によく寄せられる質問と、現在確認できている回答をまとめています。",
    items: [
      {
        id: "joining",
        question: "サーバーへはどのように参加できますか？",
        answer:
          "参加手順はDiscordでご案内する予定です。公開する招待先と手順は現在確認中です。",
        status: "pending",
      },
      {
        id: "beginners",
        question: "Rust初心者でも参加できますか？",
        answer:
          "初心者の参加条件やサポート範囲は運営確認中です。確定後に案内を更新します。",
        status: "pending",
      },
      {
        id: "wipe-schedule",
        question: "ワイプはいつ行われますか？",
        answer: "曜日と時刻を含む正式なワイプスケジュールは運営確認中です。",
        status: "pending",
      },
      {
        id: "team-size",
        question: "チーム人数の上限は何人ですか？",
        answer: "チーム人数上限と協力行為に関する条件は運営確認中です。",
        status: "pending",
      },
      {
        id: "raid-window",
        question: "レイド可能時間を教えてください。",
        answer:
          "レイド可能時間を設ける方針です。具体的な曜日、時刻、時間外の扱いは運営確認中です。",
        status: "pending",
      },
      {
        id: "reporting",
        question: "ルール違反はどのように報告しますか？",
        answer:
          "F7レポートを含む正式な報告手順と、必要な証拠・情報を運営確認中です。",
        status: "pending",
      },
      {
        id: "ban-inquiries",
        question: "BANについて問い合わせる方法はありますか？",
        answer:
          "問い合わせ窓口、必要情報、回答方針を運営確認中です。正式な窓口の公開後にご連絡ください。",
        status: "pending",
      },
      {
        id: "vip-purchase",
        question: "VIPはどこで購入できますか？",
        answer:
          "VIPの提供内容、料金、正式なTebex購入ページは運営確認中です。現在は購入先を掲載していません。",
        status: "pending",
      },
      {
        id: "language-support",
        question: "日本語以外にも対応していますか？",
        answer:
          "このサイトは日本語と英語で表示できます。ゲーム内および運営サポートの対応言語は確認中です。",
        status: "confirmed",
      },
    ],
  },
  moderator: {
    id: "moderator",
    eyebrow: "Moderator Recruitment",
    title: "モデレーター募集",
    description:
      "コミュニティを公平かつ継続的に支えるモデレーターについてご案内します。",
    status: "pending",
    statusTitle: "募集内容は運営確認中です",
    statusDescription:
      "募集状況、権限、活動内容、応募条件が確定するまで、応募受付中とは表示しません。",
    items: [
      {
        id: "responsibilities",
        title: "主な活動内容",
        description:
          "プレイヤー対応やルール違反の確認などを想定していますが、正式な担当範囲は確認中です。",
        icon: "clipboard",
        status: "pending",
      },
      {
        id: "requirements",
        title: "応募条件",
        description: "活動頻度、年齢、経験などを含む応募条件は運営確認中です。",
        icon: "user-check",
        status: "pending",
      },
      {
        id: "ideal-candidate",
        title: "求める人物像",
        description:
          "責任、公平性、継続性を重視する方針です。具体的な選考基準は確認中です。",
        icon: "shield",
        status: "pending",
      },
    ],
    applicationTitle: "応募方法",
    applicationDescription:
      "応募先と受付方法は運営確認中です。正式なDiscordチャンネルまたはフォームの確認後に掲載します。",
    applicationAction: null,
  },
  news: {
    id: "news",
    eyebrow: "News",
    title: "お知らせ",
    description:
      "メンテナンス、アップデート、イベントなどの最新情報を掲載します。",
    categoryLabels: {
      notice: "お知らせ",
      maintenance: "メンテナンス",
      update: "アップデート",
      event: "イベント",
      important: "重要",
      incident: "障害情報",
    },
    items: [],
    emptyTitle: "現在、掲載中のお知らせはありません",
    emptyDescription:
      "確認済みのお知らせが用意でき次第、最新のものから掲載します。",
  },
  finalCta: {
    eyebrow: "Join the Community",
    title: "Japan Hideaway Serverに参加しよう",
    description:
      "参加方法、最新情報、サポートに関する案内はDiscordでお知らせします。",
    action: {
      id: "final-discord",
      label: "Discordに参加",
      ariaLabel: "Japan Hideaway ServerのDiscordに参加する",
      destination: "discord",
    },
  },
  footer: {
    ariaLabel: "フッター",
    description:
      "社会人・学生向けのRustコミュニティサーバー、Japan Hideaway Serverの公式案内サイトです。",
    communityDisclaimer:
      "Japan Hideaway Serverはコミュニティ運営のサーバーであり、Facepunch Studiosの公式サイトまたは公式サーバーではありません。",
    navigationLabel: "フッターナビゲーション",
    backToTopLabel: "ページ上部へ戻る",
    copyrightName: "Japan Hideaway Server",
  },
} satisfies SiteContent;
