import type { SiteContent } from "./types";

export const en = {
  locale: "en",
  metadata: {
    title: "Japan Hideaway Server | Rust Community Server",
    description:
      "The official information site for Japan Hideaway Server, a Rust community server for working adults and students. Find server information, rules, VIP details, FAQs, moderator recruitment, and news.",
    openGraphImageAlt: "Japan Hideaway Server official information site",
  },
  common: {
    siteName: "Japan Hideaway Server",
    skipToContent: "Skip to main content",
    joinDiscord: "Join Discord",
    externalLink: "External link",
    opensInNewTab: "Opens in a new tab",
    learnMore: "Learn more",
    backToTop: "Back to top",
    unavailable: "Currently unavailable",
    pendingConfirmation: "Pending staff confirmation",
    statusLabels: {
      confirmed: "Confirmed",
      pending: "In preparation",
    },
  },
  theme: {
    label: "Display theme",
    dark: "Dark",
    light: "Light",
    currentTheme: "Current theme",
    switchToDark: "Switch to dark theme",
    switchToLight: "Switch to light theme",
  },
  language: {
    label: "Display language",
    japanese: "Japanese",
    english: "English",
    currentLanguage: "Current language",
    switchToJapanese: "Switch to Japanese",
    switchToEnglish: "Switch to English",
  },
  navigation: {
    ariaLabel: "Main navigation",
    homeLabel: "Go to the top of Japan Hideaway Server",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    mobileMenuLabel: "Mobile navigation",
    items: [
      { id: "server", label: "Server" },
      { id: "rules", label: "Rules" },
      { id: "vip", label: "VIP" },
      { id: "faq", label: "FAQ" },
      { id: "moderator", label: "Moderator Recruitment" },
      { id: "news", label: "News" },
    ],
    discordAction: {
      id: "header-discord",
      label: "Join Discord",
      ariaLabel: "Join the Japan Hideaway Server Discord",
      destination: "discord",
    },
  },
  hero: {
    id: "top",
    eyebrow: "Rust Community Server",
    title: "Japan Hideaway Server",
    subtitle: "A Rust server with raid restrictions",
    description:
      "A community server with settings close to official servers and designated no-raid hours, where working adults and students can play with peace of mind.",
    primaryAction: {
      id: "hero-discord",
      label: "Join Discord",
      ariaLabel: "Join the Japan Hideaway Server Discord",
      destination: "discord",
    },
    secondaryAction: {
      id: "hero-rules",
      label: "View Rules",
      ariaLabel: "View the server rules",
      destination: "rules",
    },
    backgroundAlt: "",
    connection: {
      title: "Connect to the Server",
      description:
        "Paste the command into the F1 console, or launch Rust through Steam and connect directly.",
      commandLabel: "F1 connection command",
      copyLabel: "Copy command",
      copiedLabel: "Copied",
      copyErrorLabel: "Could not copy",
      steamLabel: "Launch with Steam",
      steamAriaLabel: "Launch Steam and connect to Japan Hideaway Server",
      unavailable: "Available after the server address is configured.",
    },
  },
  server: {
    id: "server",
    eyebrow: "Server Information",
    title: "Server Information",
    description:
      "Learn about the guiding principles of Japan Hideaway Server and what to know before joining.",
    items: [
      {
        id: "audience",
        title: "For Working Adults, Students, and Beginners",
        description:
          "We value an environment where players can make the most of limited playtime and feel comfortable joining.",
        icon: "users",
        status: "confirmed",
      },
      {
        id: "community",
        title: "Close to Official Server Settings",
        description:
          "A community server based on settings close to official servers, with additional rules that respect everyday schedules.",
        icon: "community",
        status: "confirmed",
      },
      {
        id: "raid-window",
        title: "Raid Restrictions",
        description:
          "Raiding is allowed from 18:00 to 24:00 on weekdays and from 12:00 to 24:00 on Saturday and Sunday. Building raids are prohibited at all other times.",
        icon: "clock",
        status: "confirmed",
      },
      {
        id: "operations",
        title: "Weekly Wipes and Four-Player Teams",
        description:
          "Map and blueprint wipes take place every Friday at 18:00 Japan time. Teams are limited to four players and the map size is 3500.",
        icon: "settings",
        status: "confirmed",
      },
    ],
    pendingNotice:
      "The wipe time is stated in Japan time. Rules and settings may change, so check the latest announcement when joining.",
  },
  rules: {
    id: "rules",
    eyebrow: "Rules",
    title: "Important Rules",
    description:
      "This page provides a concise overview of the most important rules for a safe experience. Please check the Discord server for full details.",
    noticeTitle: "Read before joining",
    notice:
      "Raiding outside the permitted hours, teaming, unfair play, and abusive conduct are handled according to the specific rule, with penalties including warnings, kicks, temporary bans, and permanent bans. If you are unsure about an action or make an accidental mistake, contact staff promptly through a Discord ticket.",
    items: [
      {
        id: "raid-window",
        title: "Raiding Hours",
        description:
          "Raiding is allowed from 18:00 to 24:00 on weekdays and 12:00 to 24:00 on Saturday and Sunday. Attacks on buildings outside these hours are penalized automatically. Outdoor deployables, code raids, twig or wood-upgrade structures, your own base, and nearby TC pillars are exempt.",
        icon: "clock",
        status: "confirmed",
        important: true,
      },
      {
        id: "team-size",
        title: "Team Size Limit",
        description:
          "Teams are limited to four players. Sharing supplies, fighting together, or sharing a base with players outside your team is prohibited and may result in penalties ranging from a warning to a permanent ban. If you transfer supplies when retiring, clear sleeping bag and TC authorization, log out promptly, and do not play again during that wipe.",
        icon: "users",
        status: "confirmed",
        important: true,
      },
      {
        id: "fair-play",
        title: "Unfair Play and Exploits",
        description:
          "Cheats, glitches, unauthorized tools, and other conduct prohibited on official servers are subject to a permanent ban. Automated or temporary kicks and bans may also be applied, and appeals are handled in the Discord #claim-ticket channel.",
        icon: "shield",
        status: "confirmed",
      },
      {
        id: "community-conduct",
        title: "Community Conduct",
        description:
          "Abuse, inappropriate political or discriminatory statements, excessive taunting, defamation, and persistent personal attacks are prohibited. This applies to chat, voice, buildings, signs, vending machines, bases, and Discord, and problematic structures or objects will be removed. Penalties range from a warning to a permanent ban, and serious cases may be penalized without prior warning.",
        icon: "message",
        status: "confirmed",
      },
      {
        id: "reporting",
        title: "Reporting Violations",
        description:
          "Use Rust's F7 report for suspected cheating, and send recordings through a Discord ticket when needed. Other rule violations are also handled through tickets. If you accidentally destroy a building outside raiding hours, report it promptly.",
        icon: "report",
        status: "confirmed",
      },
      {
        id: "rule-updates",
        title: "Rule Updates",
        description:
          "Staff will act as fairly as possible and may change rules without prior notice to maintain a healthy environment. The server is run by community volunteers, so a perfect environment and immediate response cannot be guaranteed.",
        icon: "refresh",
        status: "confirmed",
      },
    ],
  },
  vip: {
    id: "vip",
    eyebrow: "VIP",
    title: "VIP Program",
    description:
      "We are preparing an accurate explanation of the VIP program, the benefits actually provided, pricing, and the purchase process.",
    status: "pending",
    statusTitle: "VIP is in preparation",
    statusDescription:
      "Benefits and pricing will not be published until the offering has been finalized.",
    details: [
      {
        id: "price",
        label: "Price",
        value: "Not confirmed",
        status: "pending",
      },
      {
        id: "duration",
        label: "Duration",
        value: "Not confirmed",
        status: "pending",
      },
      {
        id: "purchase-method",
        label: "Purchase Method",
        value: "Not confirmed",
        status: "pending",
      },
      {
        id: "refund-policy",
        label: "Refund and Service Availability",
        value:
          "As a general rule, VIP purchases cannot be refunded once the usage period has begun.",
        status: "pending",
      },
    ],
    benefitsTitle: "VIP Benefits",
    benefits: [],
    emptyBenefitsTitle: "No confirmed benefits have been published yet",
    emptyBenefitsDescription:
      "VIP benefits are in preparation. The latest information will be published once the offering has been finalized.",
    purchaseAction: null,
    purchaseUnavailableMessage:
      "The purchase page will be provided after the offering and official Tebex URL have been confirmed.",
    notice:
      "VIP does not provide an in-game competitive advantage. The program supports community operations, and any in-game benefits will remain limited. Benefits may change.",
  },
  faq: {
    id: "faq",
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions before joining, limited to information that can currently be verified.",
    items: [
      {
        id: "beginners",
        question: "Can Rust beginners join?",
        answer:
          "Yes. The rules are designed to make the server approachable for players with limited time and for beginners. Players are also asked to be as welcoming to beginners as possible.",
        status: "confirmed",
      },
      {
        id: "ban-inquiries",
        question: "How can I ask about a ban?",
        answer:
          "Appeals concerning penalties for cheats, glitches, or unauthorized tools are accepted through the Discord #claim-ticket channel.",
        status: "confirmed",
      },
      {
        id: "vip-purchase",
        question: "Where can I purchase VIP?",
        answer:
          "The VIP offering, pricing, and official purchase page are in preparation. No purchase destination is currently published here.",
        status: "pending",
      },
      {
        id: "language-support",
        question: "Are languages other than Japanese supported?",
        answer:
          "This website can be displayed in Japanese and English. In-game and staff support is provided in Japanese; translation tools are used for other languages.",
        status: "confirmed",
      },
      {
        id: "about-streaming",
        question: "Is streaming or video posting allowed?",
        answer:
          "Streaming and video posting are allowed. Please follow Facepunch's Terms of Service and Rust's streaming rules.",
        status: "confirmed",
      },
    ],
  },
  moderator: {
    id: "moderator",
    eyebrow: "Moderator Recruitment",
    title: "Moderator Recruitment",
    description:
      "Information about moderators who can support the community fairly and consistently.",
    status: "pending",
    statusTitle: "Recruitment details are in preparation",
    statusDescription:
      "Please wait until the recruitment status, permissions, duties, and requirements have been finalized.",
    items: [
      {
        id: "responsibilities",
        title: "Responsibilities",
        description:
          "Player support and reviewing rule violations are being considered, but the official scope of duties is still in preparation.",
        icon: "clipboard",
        status: "pending",
      },
      {
        id: "requirements",
        title: "Application Requirements",
        description:
          "Requirements such as activity level, age, and prior experience are in preparation.",
        icon: "user-check",
        status: "pending",
      },
      {
        id: "ideal-candidate",
        title: "Who We Are Looking For",
        description:
          "Responsibility, fairness, and consistency are priorities. Detailed selection criteria are still in preparation.",
        icon: "shield",
        status: "pending",
      },
    ],
    applicationTitle: "How to Apply",
    applicationDescription:
      "The application destination and process are in preparation. They will be published after an official Discord channel or form is confirmed.",
    applicationAction: null,
  },
  news: {
    id: "news",
    eyebrow: "News",
    title: "News",
    description:
      "The latest maintenance, update, event, and other server announcements will appear here.",
    categoryLabels: {
      notice: "Notice",
      maintenance: "Maintenance",
      update: "Update",
      event: "Event",
      important: "Important",
      incident: "Incident",
    },
    items: [],
    emptyTitle: "There are no published announcements",
    emptyDescription:
      "Verified announcements will be listed here from newest to oldest when available.",
  },
  terms: {
    eyebrow: "Terms of Service",
    title: "Terms of Service",
    description:
      "By using the Japan Hideaway Server, you are deemed to have agreed to these Terms of Service. Please be sure to read them carefully.",
    openLabel: "View Terms of Service",
    closeLabel: "Close Terms of Service",
    dialogLabel: "Japan Hideaway Server Terms of Service",
    introduction: [
      'These Terms of Service (the "Terms") govern the use of Japan Hideaway Server (the "Server") and its related Discord community.',
      "You may use the Server only if you agree to these Terms. If you do not agree, please do not connect to the Server or use its related Discord community.",
      "Minors must obtain consent from a parent or other legal representative before using the Server.",
      "Rust and Steam are also subject to the terms established by their respective providers. You are responsible for reviewing and complying with those terms.",
    ],
    articles: [
      {
        id: "scope",
        title: "Article 1 — Scope",
        paragraphs: [
          "These Terms apply to all matters relating to the use of the Server, its official website, and its related Discord community.",
          "Server rules, announcements, and operational guidance separately published on Discord or the official website form part of these Terms.",
        ],
      },
      {
        id: "environment",
        title: "Article 2 — User Environment",
        paragraphs: [
          "You are responsible for preparing and paying for Rust, a Steam account, network access, and any other equipment required to connect to the Server.",
          "The operators do not guarantee support or compensation for connection failures or other problems caused by your environment.",
        ],
      },
      {
        id: "prohibited-conduct",
        title: "Article 3 — Prohibited Conduct",
        paragraphs: [
          "You must not engage in any of the following conduct when using the Server or its related Discord community.",
        ],
        items: [
          "Using cheats, Aim or ESP tools, macros, scripts, modified clients, or other unauthorized tools, or engaging in conduct that reasonably suggests such use",
          "Exploiting bugs or glitches in the game or Server",
          "Circumventing or abusing raid restrictions, team-size limits, or other Server rules",
          "Abuse, discriminatory language, excessive taunting, harassment, defamation, or other disruptive conduct",
          "Unreasonably interfering with the operators, staff, or other users",
          "Unauthorized access, denial-of-service attacks, or intentionally increasing Server load",
          "Unauthorized advertising, spam, or trolling",
          "Any other conduct that the operators reasonably determine harms the safe or fair operation of the Server",
        ],
      },
      {
        id: "enforcement",
        title: "Article 4 — Enforcement and Bans",
        paragraphs: [
          "If you violate these Terms or the Server rules, the operators may issue a warning, kick, temporary suspension, permanent ban, removal from the related Discord community, or other necessary action based on the nature and severity of the violation. Serious or urgent cases may be handled without prior warning.",
          "Questions about enforcement are accepted through the designated Discord ticket system or #claim-ticket. However, logs and the complete basis for a decision may not be disclosed for security, privacy, or investigation-protection reasons, and removal of a penalty is not guaranteed.",
        ],
      },
      {
        id: "server-data",
        title: "Article 5 — Server Configuration and Data",
        paragraphs: [
          "Map and blueprint wipes are generally conducted every Friday at 18:00 Japan time. Buildings, inventories, blueprints, and other Server data may be deleted through wipes or operational action.",
          "Downtime, rollbacks, and data loss may occur. Maps, plugins, restrictions, and other settings may also be changed when operationally necessary.",
        ],
      },
      {
        id: "operations",
        title: "Article 6 — Operator Authority",
        paragraphs: [
          "To maintain safe and fair operations, the operators may stop or restart the Server, change specifications, review activity logs, adjust buildings or items, restrict access, or take other necessary administrative action.",
          "The Server is operated by community volunteers and does not guarantee continuous availability, a perfect environment, or an immediate response.",
        ],
      },
      {
        id: "disclaimer",
        title: "Article 7 — Disclaimer",
        paragraphs: [
          "The operators do not guarantee continuous availability, completeness, security, or fitness for a particular purpose.",
          "To the extent permitted by law, the operators are not liable for disputes between players, data loss, wipes, issues with the game client or Steam, Server failures, network failures, or other losses related to use of the Server, except where caused by the operators' intentional misconduct or gross negligence. This limitation does not apply where liability cannot be excluded by law.",
          "The Server is a community server provided as a hobby by individuals and volunteers. Disputes between users should generally be resolved by the parties involved.",
        ],
      },
      {
        id: "support",
        title: "Article 8 — Support",
        paragraphs: [
          "Reports of cheating, glitches, other rule violations, and questions about Server operations are generally accepted only through the ticket system in the related Discord community. Use Rust's F7 report feature when cheating is suspected.",
          "Responses may be delayed depending on operator availability and the investigation required. Individual responses and immediate action are not guaranteed.",
        ],
      },
      {
        id: "changes",
        title: "Article 9 — Changes to the Terms",
        paragraphs: [
          "The operators may amend or add to these Terms when necessary. Changes and their effective date will be announced on the official website or in the related Discord community.",
          "Unless separate consent is required by law, continued use of the Server after revised Terms take effect constitutes acceptance of the revised Terms.",
        ],
      },
      {
        id: "governing-law",
        title: "Article 10 — Governing Law and Consultation",
        paragraphs: [
          "These Terms are governed by and interpreted under the laws of Japan. If an issue arises regarding these Terms or the Server, you and the operators will discuss the matter in good faith and seek a resolution.",
        ],
      },
    ],
    supplementaryNote:
      "Please review the latest Server rules and announcements published on Discord and this website together with these Terms.",
    lastUpdatedLabel: "Last updated",
    lastUpdated: "August 3, 2026",
  },
  footer: {
    ariaLabel: "Footer",
    description:
      "The official information site for Japan Hideaway Server, a Rust community server for working adults and students.",
    communityDisclaimer:
      "Japan Hideaway Server is a community-run server and is not an official Facepunch Studios website or server.",
    navigationLabel: "Footer navigation",
    backToTopLabel: "Back to top",
    copyrightName: "Japan Hideaway Server",
  },
} satisfies SiteContent;
