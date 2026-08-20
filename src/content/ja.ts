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
      pending: "準備中",
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
    subtitle: "レイド制限がついたRustサーバー",
    description:
      "社会人や学生が安心して遊べる、レイド禁止時間を設定した公式サーバーの仕様に近いコミュニティサーバーです。",
    primaryAction: {
      id: "hero-discord",
      label: "Discordに参加",
      ariaLabel: "Japan Hideaway ServerのDiscordに参加する",
      destination: "discord",
    },
    secondaryAction: {
      id: "hero-rules",
      label: "ルールを見る",
      ariaLabel: "サーバールールを見る",
      destination: "rules",
    },
    backgroundAlt: "",
    connection: {
      title: "サーバーへ接続",
      description:
        "F1コンソールへコマンドを貼り付けるか、SteamからRustを起動して接続できます。",
      commandLabel: "F1接続コマンド",
      copyLabel: "コマンドをコピー",
      copiedLabel: "コピーしました",
      copyErrorLabel: "コピーできませんでした",
      steamLabel: "Steamで起動",
      steamAriaLabel: "Steamを起動してJapan Hideaway Serverへ接続する",
      unavailable: "接続先の設定後に利用できます。",
    },
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
          "限られたプレイ時間でもしっかり遊べることと、参加しやすい環境を大切にしています。",
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
        title: "レイド制限",
        description:
          "レイド可能時間は平日18:00〜24:00、土・日12:00〜24:00です。それ以外の時間帯は建築物へのレイドを禁止します。",
        icon: "clock",
        status: "confirmed",
      },
      {
        id: "operations",
        title: "ワイプ・定期再起動",
        description:
          "マップ・BPワイプは毎週金曜日18:00 JST、デイリーリスタートは毎日04:00 JSTです。チームは最大4人、マップサイズは3500です。",
        icon: "settings",
        status: "confirmed",
      },
    ],
    pendingNotice:
      "ワイプとデイリーリスタートの時刻はJSTです。ルールや設定は変更される場合があるため、参加時に最新の案内もご確認ください。",
  },
  rules: {
    id: "rules",
    eyebrow: "Rules",
    title: "重要なルール",
    description:
      "参加者が安心して遊べるよう、特に重要な項目を簡潔にご案内します。詳しくはDiscordサーバーにてご確認ください。",
    noticeTitle: "参加前に必ず確認してください",
    notice:
      "時間外レイド、チーミング、不正行為、他者への不適切な言動には、違反内容に応じて各ルールに定める警告・キック・有期BAN・永久BANを適用します。判断に迷う場合や誤操作があった場合は、速やかにDiscordのチケットから運営へご連絡ください。",
    items: [
      {
        id: "raid-window",
        title: "レイド可能時間",
        description:
          "平日18:00〜24:00、土・日12:00〜24:00のみレイド可能です。時間外の建築物への攻撃は自動的に処罰されます。野外設置物、パスコードレイド、藁・木強化建築、自拠点と周辺TC柱の破壊は対象外です。",
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
          "暴言、政治的・差別的な不適切発言、過度な煽り、誹謗中傷や執拗な個人攻撃は禁止です。チャット、VC、建築物、看板、自販機、拠点、Discordも対象で、問題のある設置物等は撤去します。違反は警告から永久BANの対象となり、悪質な場合は事前警告なく処罰します。",
        icon: "message",
        status: "confirmed",
      },
      {
        id: "reporting",
        title: "違反の報告方法",
        description:
          "チートなどが疑われる場合はRust内のF7レポートを利用し、録画などの証拠は必要に応じてDiscordのチケットへお送りください。その他の違反報告もチケットで受け付けます。時間外に誤って建築物を破壊した場合も、速やかに報告してください。",
        icon: "report",
        status: "confirmed",
      },
      {
        id: "rule-updates",
        title: "ルールの更新",
        description:
          "運営は可能な限り公平に対応し、健全な環境を保つためルールを予告なく変更する場合があります。有志での運営のため、完全な環境や即時対応を保証するものではありません。",
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
    statusTitle: "VIPは準備中です",
    statusDescription: "提供内容が確定するまで、特典や料金は掲載しません。",
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
        id: "refund-policy",
        label: "返金・稼働方針",
        value:
          "購入後に利用期間が開始したVIPは、原則として返金いたしかねます。",
        status: "pending",
      },
    ],
    benefitsTitle: "VIP特典",
    benefits: [],
    emptyBenefitsTitle: "確認済みの特典はまだ掲載されていません",
    emptyBenefitsDescription:
      "特典の内容は準備中です。提供内容が確定次第、最新の情報を掲載します。",
    purchaseAction: null,
    purchaseUnavailableMessage:
      "購入ページは、提供内容と正式なTebex URLの確認後にご案内します。",
    notice:
      "VIPによるゲーム内の優位性は提供しません。VIPはコミュニティ運営の支援を目的とした制度であり、ゲーム内の特典は限定的です。特典内容は変更される場合があります。",
  },
  faq: {
    id: "faq",
    eyebrow: "FAQ",
    title: "よくある質問",
    description:
      "参加前によく寄せられる質問と、現在確認できている回答をまとめています。",
    emptyTitle: "現在、掲載中のFAQはありません",
    emptyDescription: "公開準備が整い次第、こちらへ追加します。",
    unavailableTitle: "FAQを取得できません",
    unavailableDescription:
      "一時的にFAQを読み込めません。時間を置いてからもう一度お試しください。",
  },
  moderator: {
    id: "moderator",
    eyebrow: "Moderator Recruitment",
    title: "モデレーター募集",
    description:
      "コミュニティを公平かつ継続的に支えるモデレーターについてご案内します。",
    status: "pending",
    statusTitle: "募集内容は準備中です",
    statusDescription:
      "募集状況、権限、活動内容、応募条件が確定するまでお待ちください。",
    items: [
      {
        id: "responsibilities",
        title: "主な活動内容",
        description:
          "プレイヤー対応やルール違反の確認などを想定していますが、正式な担当範囲は準備中です。",
        icon: "clipboard",
        status: "pending",
      },
      {
        id: "requirements",
        title: "応募条件",
        description: "活動頻度、年齢、経験などを含む応募条件は準備中です。",
        icon: "user-check",
        status: "pending",
      },
      {
        id: "ideal-candidate",
        title: "求める人物像",
        description:
          "責任、公平性、継続性を重視する方針です。具体的な選考基準は準備中です。",
        icon: "shield",
        status: "pending",
      },
    ],
    applicationTitle: "応募方法",
    applicationDescription:
      "応募先と受付方法は準備中です。正式なDiscordチャンネルまたはフォームの確認後に掲載します。",
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
    emptyTitle: "現在、掲載中のお知らせはありません",
    emptyDescription:
      "確認済みのお知らせが用意でき次第、最新のものから掲載します。",
    unavailableTitle: "お知らせを取得できません",
    unavailableDescription:
      "一時的にお知らせを読み込めません。時間を置いてからもう一度お試しください。",
    translationPendingTitle: "英語版を準備中です",
    translationPendingDescription:
      "英語版が公開されるまで、しばらくお待ちください。",
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "利用規約",
    description:
      "Japan Hideaway Serverを利用した時点で、本利用規約に同意したものとみなします。必ずご確認ください。",
    openLabel: "利用規約を表示",
    closeLabel: "利用規約を閉じる",
    dialogLabel: "Japan Hideaway Server 利用規約",
    introduction: [
      "本利用規約（以下「本規約」といいます）は、Japan Hideaway Server（以下「本サーバー」といいます）および関連するDiscordコミュニティの利用条件を定めるものです。",
      "利用者は、本規約の内容に同意した場合に限り、本サーバーを利用できます。同意いただけない場合は、本サーバーへの接続および関連Discordコミュニティの利用をお控えください。",
      "未成年者は、法定代理人（親権者等）の同意を得たうえで本サーバーを利用してください。",
      "RustおよびSteamの利用には、それぞれの提供者が定める規約も適用されます。利用者は各規約を確認し、遵守する責任を負います。",
    ],
    articles: [
      {
        id: "scope",
        title: "第1条（適用範囲）",
        paragraphs: [
          "本規約は、本サーバー、公式Webサイトおよび関連Discordコミュニティの利用に関する一切の関係に適用されます。",
          "Discordや公式Webサイトで別途掲載するサーバールール、告知および運営上の案内も、本規約の一部を構成します。",
        ],
      },
      {
        id: "environment",
        title: "第2条（利用環境）",
        paragraphs: [
          "利用者は、Rust本体、Steamアカウント、ネットワーク環境その他接続に必要な設備を、自己の責任と費用で準備するものとします。",
          "利用者側の環境に起因する接続不良や不具合について、運営はサポートまたは補償を保証しません。",
        ],
      },
      {
        id: "prohibited-conduct",
        title: "第3条（禁止行為）",
        paragraphs: [
          "利用者は、本サーバーおよび関連Discordコミュニティの利用にあたり、次の行為を行ってはなりません。",
        ],
        items: [
          "チート、Aim・ESP、Macro、スクリプト、改造クライアントその他の不正ツールを使用する行為、または不正利用を疑わせる行為",
          "ゲームやサーバーの不具合を利用するグリッチ行為",
          "レイド制限、チーム人数制限その他のサーバールールを回避または悪用する行為",
          "暴言、差別的表現、過度な煽り、嫌がらせ、誹謗中傷その他の迷惑行為",
          "運営、スタッフまたは他の利用者の活動を不当に妨害する行為",
          "不正アクセス、DoS攻撃、サーバー負荷を意図的に増大させる行為",
          "無断の宣伝、スパム、荒らし行為",
          "その他、運営が本サーバーの安全または公平な運営を損なうと合理的に判断する行為",
        ],
      },
      {
        id: "enforcement",
        title: "第4条（処分・BAN）",
        paragraphs: [
          "利用者が本規約またはサーバールールに違反した場合、運営は違反内容や悪質性に応じて、警告、キック、一時的な利用停止、永久BAN、関連Discordコミュニティからの退出その他必要な措置を講じることがあります。重大または緊急性の高い場合は、事前の警告なく措置を行うことがあります。",
          "処分に関する問い合わせは、運営が指定するDiscordチケットまたは#claim-ticketから受け付けます。ただし、安全対策、プライバシー保護または調査手法保護のため、ログや判断根拠のすべてを開示できない場合があり、処分解除を保証するものではありません。",
        ],
      },
      {
        id: "server-data",
        title: "第5条（サーバー仕様・データ）",
        paragraphs: [
          "本サーバーでは、原則として毎週金曜日18:00（日本時間）にMap・BPワイプを実施します。建築物、インベントリ、ブループリントその他のサーバーデータは、ワイプや運営上の対応により削除される場合があります。",
          "サーバーダウン、ロールバック、データ消失等が発生する可能性があります。また、マップ、プラグイン、制限事項その他の設定は、運営上の必要に応じて変更される場合があります。",
        ],
      },
      {
        id: "operations",
        title: "第6条（運営の権限）",
        paragraphs: [
          "運営は、安全かつ公平な運営のため、サーバーの停止・再起動・仕様変更、行動ログの確認、建築物やアイテムの調整、利用制限その他必要な管理措置を行うことがあります。",
          "本サーバーは有志のボランティアにより運営されているため、常時稼働、完全な環境または即時対応を保証するものではありません。",
        ],
      },
      {
        id: "disclaimer",
        title: "第7条（免責事項）",
        paragraphs: [
          "運営は、本サーバーの継続的な提供、完全性、安全性または特定目的への適合性を保証しません。",
          "プレイヤー間のトラブル、データ消失、ワイプ、ゲームクライアント・Steamの不具合、サーバー障害、ネットワーク障害その他本サーバーの利用に関連して生じた損害について、運営は、運営の故意または重過失による場合を除き、法令上許される範囲で責任を負いません。法令により免責が認められない場合は、この限りではありません。",
          "本サーバーは、個人および有志が趣味として提供するコミュニティサーバーです。利用者間の問題は、当事者間での解決を原則とします。",
        ],
      },
      {
        id: "support",
        title: "第8条（サポート）",
        paragraphs: [
          "チート、グリッチ、その他のルール違反報告およびサーバー運営に関する問い合わせは、原則として関連Discordコミュニティのチケットシステムから受け付けます。チートが疑われる場合は、Rust内のF7レポートも利用してください。",
          "運営状況や調査内容により回答が遅れる場合があり、個別の回答または即時対応を保証するものではありません。",
        ],
      },
      {
        id: "changes",
        title: "第9条（規約の変更）",
        paragraphs: [
          "運営は、必要に応じて本規約を変更または追記できます。変更内容と適用時期は、公式Webサイトまたは関連Discordコミュニティで告知します。",
          "法令上別途の同意が必要な場合を除き、変更後の規約の適用開始後も本サーバーの利用を継続した場合、利用者は変更後の規約に同意したものとみなされます。",
        ],
      },
      {
        id: "governing-law",
        title: "第10条（準拠法・協議）",
        paragraphs: [
          "本規約は、日本法に準拠し、日本法に従って解釈されます。本規約または本サーバーに関して問題が生じた場合、利用者と運営は誠実に協議し、解決を図るものとします。",
        ],
      },
    ],
    supplementaryNote:
      "本規約とあわせて、Discordおよび本Webサイトに掲載する最新のサーバールール・告知をご確認ください。",
    lastUpdatedLabel: "最終更新日",
    lastUpdated: "2026年8月3日",
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
