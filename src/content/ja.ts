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
      "公式サーバーの仕様に近いゲームバランスを基に、平日と土・日でレイド可能時間を設定しています。限られた時間でも遊びやすく、初心者にも配慮したコミュニティサーバーです。",
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
        title: "社会人・学生・初心者向け",
        description:
          "限られたプレイ時間でもしっかり遊べることと、Rust初心者が参加しやすい環境を大切にしています。",
        icon: "users",
        status: "confirmed",
      },
      {
        id: "community",
        title: "公式仕様に近い設定",
        description:
          "公式サーバーに近い仕様を基に、生活リズムへ配慮したルールを加えたコミュニティサーバーです。",
        icon: "community",
        status: "confirmed",
      },
      {
        id: "raid-window",
        title: "時間限定レイド",
        description:
          "レイド可能時間は平日18:00〜24:00、土・日12:00〜24:00です。それ以外の時間帯は建築物へのレイドを禁止します。",
        icon: "clock",
        status: "confirmed",
      },
      {
        id: "operations",
        title: "毎週ワイプ・最大4人",
        description:
          "Map・BPワイプは毎週金曜日の日本時間18:00、チームは最大4人、マップサイズは3500です。",
        icon: "settings",
        status: "confirmed",
      },
    ],
    pendingNotice:
      "ワイプ時刻は日本時間です。ルールや設定は変更される場合があるため、参加時に最新の案内もご確認ください。",
  },
  rules: {
    id: "rules",
    eyebrow: "Rules",
    title: "重要なルール",
    description:
      "参加者が安心して遊べるよう、LPでは特に重要な項目を簡潔にご案内します。",
    noticeTitle: "参加前に必ず確認してください",
    notice:
      "時間外レイド、チーミング、不正行為、他者への不適切な言動には、違反内容に応じて各ルールに定める警告・キック・有期BAN・永久BANを適用します。判断に迷う場合や誤操作があった場合は、速やかにDiscordのチケットから運営へご連絡ください。",
    items: [
      {
        id: "raid-window",
        title: "レイド可能時間",
        description:
          "平日18:00〜24:00、土・日12:00〜24:00のみレイド可能です。時間外の建築物への攻撃は1回目警告・2回目以降キック、破壊は自動的に次回ワイプまでBANとなり、ログ確認後に違反者の拠点を破壊します。野外設置物、パスコードレイド、藁・木強化建築、自拠点と周辺TC柱の破壊は対象外ですが、ボート建築は対象です。",
        icon: "clock",
        status: "confirmed",
        important: true,
      },
      {
        id: "team-size",
        title: "チーム人数上限",
        description:
          "チームは最大4人です。チーム外プレイヤーとの物資共有、共闘、拠点共有は禁止し、違反は警告から永久BANの対象となります。引退時に物資を譲渡した場合は寝袋・TCなどの権限を解除し、速やかにログアウトして当該ワイプ中のプレイを控えてください。",
        icon: "users",
        status: "confirmed",
        important: true,
      },
      {
        id: "fair-play",
        title: "不正行為への対応",
        description:
          "チート、グリッチ、不正ツールなど、公式サーバーで禁止されている行為は永久BAN対象です。検知状況により自動・一時的なキックやBANを行う場合があり、異議申し立てはDiscordの#claim-ticketで受け付けます。",
        icon: "shield",
        status: "confirmed",
      },
      {
        id: "community-conduct",
        title: "コミュニティでの振る舞い",
        description:
          "暴言、政治的・差別的な不適切発言、過度な煽り、誹謗中傷や執拗な個人攻撃は禁止です。チャット、VC、建築物、看板、自販機、拠点、Discordも対象で、問題のある設置物等は撤去します。違反は警告から永久BANの対象となり、悪質な場合は事前警告なく処分しますが、サーバーや運営への意見・批判自体は禁止しません。",
        icon: "message",
        status: "confirmed",
      },
      {
        id: "reporting",
        title: "違反の報告方法",
        description:
          "チートなどが疑われる場合はRust内のF7レポートを利用し、録画などの証拠は必要に応じてDiscordのチケットへお送りください。その他の違反報告もチケットで受け付けます。時間外に誤って建築物を破壊した場合も、速やかに運営へ報告してください。",
        icon: "report",
        status: "confirmed",
      },
      {
        id: "rule-updates",
        title: "ルールの更新",
        description:
          "運営は可能な限り公平に対応し、健全な環境を保つためルールを予告なく変更する場合があります。ボランティア運営のため、完全な環境や即時対応を保証するものではありません。初心者への配慮をお願いします。",
        icon: "refresh",
        status: "confirmed",
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
          "参加できます。限られた時間でも遊びやすく、初心者にも配慮したルールを設けています。プレイヤーの皆さまも初心者へできる限り優しく接してください。",
        status: "confirmed",
      },
      {
        id: "wipe-schedule",
        question: "ワイプはいつ行われますか？",
        answer: "Map・BPワイプは、毎週金曜日の日本時間18:00に行います。",
        status: "confirmed",
      },
      {
        id: "team-size",
        question: "チーム人数の上限は何人ですか？",
        answer:
          "最大4人です。チーム外プレイヤーとの物資共有、共闘、拠点共有は禁止しています。",
        status: "confirmed",
      },
      {
        id: "raid-window",
        question: "レイド可能時間を教えてください。",
        answer:
          "平日は18:00〜24:00、土・日は12:00〜24:00のみレイド可能です。時間外の建築物破壊は次回ワイプまでのBAN対象となります。",
        status: "confirmed",
      },
      {
        id: "reporting",
        question: "ルール違反はどのように報告しますか？",
        answer:
          "チートなどが疑われる場合はRust内のF7レポートを利用してください。録画などの証拠やその他のルール違反は、Discordのチケットから運営へご報告ください。",
        status: "confirmed",
      },
      {
        id: "ban-inquiries",
        question: "BANについて問い合わせる方法はありますか？",
        answer:
          "チート・グリッチ・不正ツールに関する処分への異議申し立ては、Discordの#claim-ticketから受け付けます。",
        status: "confirmed",
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
