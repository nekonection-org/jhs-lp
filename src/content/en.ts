import type { SiteContent } from "./types";

export const en = {
  locale: "en",
  metadata: {
    title: "Japan Hideaway Server | Rust Server",
    description:
      "The official website of Japan Hideaway Server, a Rust community server with designated raiding hours.",
    openGraphImageAlt: "Japan Hideaway Server official website preview",
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
    settingsTitle: "Settings",
    settingsDescription:
      "Server settings and operating times are listed separately below. Review the complete Server Rules on this page for applicable conditions and exceptions.",
    welcomeTitle: "Welcome to Japan Hideaway Server!",
    welcomeDescription:
      "We are a Rust community server where players from beginners to veterans, including working adults and students, respect each other's playstyles and work toward a fair and comfortable environment. To make limited playtime enjoyable, our game balance stays close to official servers, with raid hours and operating rules designed around everyday schedules.",
    highlights: [
      {
        id: "audience",
        title: "For Working Adults, Students, and Beginners",
        description:
          "We value an environment where players can make the most of limited playtime and feel comfortable joining.",
        icon: "users",
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
    ],
    settings: [
      {
        id: "team-limit",
        label: "Team limit",
        value: "Up to 4 players (Solo / Duo / Trio / Quad)",
      },
      { id: "map-size", label: "Map size", value: "3500" },
      {
        id: "map-bp-wipe",
        label: "Map / BP wipe",
        value: "Every Friday at 18:00 JST",
      },
      {
        id: "daily-restart",
        label: "Daily restart",
        value: "Daily at 04:00 JST",
      },
      {
        id: "weekday-raids",
        label: "Raid hours (weekdays)",
        value: "18:00–24:00 JST",
      },
      {
        id: "weekend-raids",
        label: "Raid hours (weekends)",
        value: "12:00–24:00 JST",
      },
    ],
    pendingNotice:
      "Wipe and daily restart times are stated in JST. Rules and settings may change, so check the latest announcement when joining.",
  },
  rules: {
    id: "rules",
    eyebrow: "Rules",
    title: "Important Rules",
    description:
      "This page provides a concise overview of the most important rules for a safe experience. The complete Server Rules are also available on this website.",
    noticeTitle: "Read before joining",
    notice:
      "Raiding outside the permitted hours, teaming, unfair play, and abusive conduct are handled according to the specific rule, with penalties including warnings, kicks, temporary bans, and permanent bans. If you are unsure about an action or make an accidental mistake, contact staff promptly through a Discord ticket.",
    items: [
      {
        id: "raid-window",
        title: "Raiding Hours",
        description:
          "Raiding is allowed from 18:00 to 24:00 on weekdays and 12:00 to 24:00 on Saturday and Sunday. Attacking another player's building outside these hours is handled through escalating penalties; actually destroying it results in an automatic ban until the next wipe. See the complete Rules for exemptions.",
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
          "Cheats, glitches, unauthorized tools, and other conduct prohibited on official servers are subject to a permanent ban. Appeals are handled through Discord #claim-ticket; Admins and Moderators do not respond to direct messages.",
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
    rulebook: {
      title: "Japan Hideaway Server Rules",
      openLabel: "View the Complete Server Rules",
      closeLabel: "Close the Complete Server Rules",
      blocks: [
        {
          id: "raid-rules",
          title: "Permitted Raid Hours and Off-Hours Raiding",
          paragraphs: [
            "“Off-hours raiding” means attacking or destroying another player's building outside the permitted raid hours. All times are in Japan Standard Time (JST).",
          ],
          items: [
            {
              id: "weekdays",
              label: "Permitted raid hours on weekdays",
              description: "18:00–24:00",
            },
            {
              id: "weekends",
              label: "Permitted raid hours on Saturday and Sunday",
              description: "12:00–24:00",
            },
            {
              id: "prohibited-scope",
              label: "What counts as off-hours raiding",
              description:
                "Attacking or destroying another player's building, including walls, doors, and boat bases",
            },
            {
              id: "exemptions",
              label: "What does not count as off-hours raiding",
              description:
                "Destroying outdoor deployables such as turrets, code raids, twig or wood-upgrade structures, your own base, and nearby TC pillars",
            },
            {
              id: "attack-enforcement",
              label: "Violation without destroying a building",
              description:
                "First violation: warning; second violation: server kick; another violation after a kick: the offender and the entire team are banned until the next wipe",
            },
            {
              id: "destruction-enforcement",
              label: "If a building is destroyed",
              description:
                "Regardless of prior violations, the player is automatically banned until the next wipe. Staff will destroy the offender's base after reviewing the logs",
            },
            {
              id: "accident",
              label: "Accidental destruction",
              description: "Report it to staff immediately",
            },
          ],
        },
        {
          id: "cheating",
          title: "1. Cheats, Glitches, and Unauthorized Tools",
          penalty: "Permanent ban",
          paragraphs: [
            "All conduct prohibited on official servers is also prohibited here. Depending on automated detection and the investigation, a player may be automatically or temporarily kicked or banned from the Server.",
          ],
          items: [
            {
              id: "party-member",
              label: "Players in the same party",
              description:
                "A 30-day ban for the first incident and a permanent ban for the second and later incidents",
            },
            {
              id: "appeal",
              label: "Appeals",
              description:
                "Admins and Moderators do not respond to direct messages. Use Discord #claim-ticket for assistance.",
            },
          ],
        },
        {
          id: "conduct",
          title:
            "2. Abuse, Discriminatory Language, Excessive Taunting, and Defamation",
          penalty: "Warning to permanent ban",
          paragraphs: [
            "Political or discriminatory statements, persistent personal attacks, and other conduct beyond generally acceptable social standards are prohibited.",
          ],
          items: [
            {
              id: "locations",
              description:
                "This applies to in-game chat, voice chat, vending machines, buildings, signs, bases, and channels in the Discord server.",
            },
            {
              id: "removal",
              description:
                "Problematic buildings, signs, vending machines, bases, and similar content will be removed.",
            },
            {
              id: "serious",
              description:
                "Serious conduct may result in a temporary or permanent ban without prior warning.",
            },
          ],
        },
        {
          id: "teaming",
          title: "3. Team-Size Violations (Teaming)",
          penalty: "Warning to permanent ban",
          paragraphs: [
            "Teams are limited to four players. Sharing supplies, fighting together, or sharing a base with players outside your team is prohibited.",
          ],
          items: [
            {
              id: "retirement",
              label: "Transferring supplies when retiring",
              description:
                "The transfer itself is allowed, but afterward you must clear sleeping bag, TC, and other authorization, log out promptly, and refrain from playing again during that wipe.",
            },
          ],
        },
        {
          id: "feedback",
          title: "Feedback and Criticism",
          paragraphs: [
            "Feedback or criticism regarding the Server or its operators is not itself prohibited.",
            "However, feedback or criticism does not justify abuse, discrimination, defamation, persistent personal attacks, or other conduct beyond generally acceptable social standards.",
          ],
        },
        {
          id: "operations",
          title: "Operating Policy and Reports",
          paragraphs: [
            "Playstyles are generally not restricted, but prohibited conduct under these Rules is not recognized as a playstyle. Ignoring warnings or engaging in serious misconduct may result in a ban.",
          ],
          items: [
            {
              id: "fairness",
              description:
                "The operators will treat all players as fairly as reasonably possible.",
            },
            {
              id: "cheat-report",
              description:
                "If you suspect cheats, glitches, or unauthorized tools, use Rust's F7 report feature and, when appropriate, provide recordings or other evidence through a Discord ticket.",
            },
            {
              id: "other-report",
              description:
                "Report other rule violations through the Discord ticket system.",
            },
            {
              id: "changes",
              description:
                "These Rules may be changed without prior notice to maintain a healthy Server environment.",
            },
            {
              id: "volunteer",
              description:
                "The Server is managed by volunteers who contribute their own time and money. We will improve the Server environment and anti-cheat response where reasonably possible, but cannot guarantee a perfect environment or an immediate response at all times.",
            },
            {
              id: "choice",
              description:
                "If the Server's policies or environment do not suit you, please consider using another server.",
            },
          ],
        },
      ],
      supplementaryNote:
        "The content on this website is the current authoritative version of the Server Rules. Please also review the Terms of Service and latest announcements.",
      lastUpdatedLabel: "Last updated",
      lastUpdated: "August 25, 2026",
    },
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
    emptyTitle: "No FAQs are currently published",
    emptyDescription: "New answers will appear here when they are ready.",
    unavailableTitle: "FAQs are unavailable",
    unavailableDescription:
      "FAQs could not be loaded temporarily. Please try again later.",
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
    emptyTitle: "There are no published announcements",
    emptyDescription:
      "Verified announcements will be listed here from newest to oldest when available.",
    unavailableTitle: "Announcements are temporarily unavailable",
    unavailableDescription:
      "We could not load announcements. Please try again in a few minutes.",
    archiveTitle: "Past announcements",
    archiveDescription:
      "Published announcements are shown five at a time, newest first.",
    viewArchive: "View past announcements",
    backToLatest: "Back to latest announcements",
    paginationLabel: "Announcement pages",
    previousPage: "Previous page",
    nextPage: "Next page",
    translationPendingTitle: "English translation in progress",
    translationPendingDescription:
      "The English version of this announcement is not available yet.",
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
          "Server Rules, announcements, and operational guidance published on the official website form part of these Terms. Discord may be used for update notices and support, but the latest Server Rules on the official website are authoritative.",
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
          "The operators may amend or add to these Terms when necessary. Changes and their effective date will be published on the official website and may also be announced in the related Discord community.",
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
      "Please review the latest Server Rules and announcements on this website together with these Terms. Discord is used as a supplementary channel for inquiries and update notices.",
    lastUpdatedLabel: "Last updated",
    lastUpdated: "August 25, 2026",
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
