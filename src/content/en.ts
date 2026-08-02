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
      pending: "Pending confirmation",
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
    subtitle: "A Rust community server for working adults and students",
    description:
      "A community server based on settings close to official servers, with separate raiding hours for weekdays and weekends. It is designed for players with limited time and welcomes Rust beginners.",
    primaryAction: {
      id: "hero-discord",
      label: "Join Discord",
      ariaLabel: "Join the Japan Hideaway Server Discord",
      destination: "discord",
    },
    secondaryAction: {
      id: "hero-rules",
      label: "View Rules",
      ariaLabel: "View the important server rules",
      destination: "rules",
    },
    backgroundAlt: "",
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
        title: "For Adults, Students, and Beginners",
        description:
          "The server is designed to be approachable for players with limited time and for people who are new to Rust.",
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
        title: "Time-Limited Raiding",
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
      "This page will provide a concise overview of the rules that matter most for a safe and welcoming experience.",
    noticeTitle: "Read before joining",
    notice:
      "Raiding outside the permitted hours, teaming, unfair play, and abusive conduct are handled according to the specific rule, with penalties including warnings, kicks, temporary bans, and permanent bans. If you are unsure about an action or make an accidental mistake, contact staff promptly through a Discord ticket.",
    items: [
      {
        id: "raid-window",
        title: "Raiding Hours",
        description:
          "Raiding is allowed from 18:00 to 24:00 on weekdays and 12:00 to 24:00 on Saturday and Sunday. Outside these hours, attacking a building receives a warning for the first offense and a kick from the second; destroying one triggers an automatic ban until the next wipe, and staff will destroy the offender's base after reviewing the logs. Outdoor deployables, code raids, twig or wood-upgrade structures, your own base, and nearby TC pillars are exempt, but boat structures are covered.",
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
          "Abuse, inappropriate political or discriminatory statements, excessive taunting, defamation, and persistent personal attacks are prohibited. This applies to chat, voice, buildings, signs, vending machines, bases, and Discord, and problematic structures or objects will be removed. Penalties range from a warning to a permanent ban, with serious cases handled without prior warning; criticism of the server or staff is not itself prohibited.",
        icon: "message",
        status: "confirmed",
      },
      {
        id: "reporting",
        title: "Reporting Violations",
        description:
          "Use Rust's F7 report for suspected cheating, and send recordings through a Discord ticket when needed. Other rule violations are also handled through tickets. If you accidentally destroy a building outside raiding hours, report it to staff promptly.",
        icon: "report",
        status: "confirmed",
      },
      {
        id: "rule-updates",
        title: "Rule Updates",
        description:
          "Staff will act as fairly as possible and may change rules without prior notice to maintain a healthy environment. The server is run by volunteers, so a perfect environment and immediate response cannot be guaranteed. Please be considerate toward beginners.",
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
    statusTitle: "VIP information is pending staff confirmation",
    statusDescription:
      "Benefits and pricing will not be presented as available until the offering has been confirmed.",
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
        id: "discord-role",
        label: "Discord Role",
        value: "Not confirmed",
        status: "pending",
      },
    ],
    benefitsTitle: "VIP Benefits",
    benefits: [],
    emptyBenefitsTitle: "No confirmed benefits have been published yet",
    emptyBenefitsDescription:
      "Only benefits verified as actually available will be added after confirmation.",
    purchaseAction: null,
    purchaseUnavailableMessage:
      "The purchase page will be provided after the offering and official Tebex URL have been confirmed.",
    notice:
      "Unimplemented benefits or benefits that significantly disrupt game balance will not be presented as currently available.",
  },
  faq: {
    id: "faq",
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    description:
      "Answers to common questions before joining, limited to information that can currently be verified.",
    items: [
      {
        id: "joining",
        question: "How can I join the server?",
        answer:
          "Joining instructions are planned for Discord. The public invite destination and steps are currently being confirmed.",
        status: "pending",
      },
      {
        id: "beginners",
        question: "Can Rust beginners join?",
        answer:
          "Yes. The rules are designed to make the server approachable for players with limited time and for beginners. Players are also asked to be as welcoming to beginners as possible.",
        status: "confirmed",
      },
      {
        id: "wipe-schedule",
        question: "When does the server wipe?",
        answer:
          "Map and blueprint wipes take place every Friday at 18:00 Japan time.",
        status: "confirmed",
      },
      {
        id: "team-size",
        question: "What is the maximum team size?",
        answer:
          "The maximum team size is four. Sharing supplies, fighting together, or sharing a base with players outside your team is prohibited.",
        status: "confirmed",
      },
      {
        id: "raid-window",
        question: "What are the designated raiding hours?",
        answer:
          "Raiding is allowed from 18:00 to 24:00 on weekdays and 12:00 to 24:00 on Saturday and Sunday. Destroying another player's building outside these hours results in a ban until the next wipe.",
        status: "confirmed",
      },
      {
        id: "reporting",
        question: "How do I report a rule violation?",
        answer:
          "Use Rust's F7 report for suspected cheating. Send recordings and reports of other rule violations to staff through a Discord ticket.",
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
          "The VIP offering, pricing, and official Tebex purchase page are pending confirmation. No purchase destination is currently published here.",
        status: "pending",
      },
      {
        id: "language-support",
        question: "Are languages other than Japanese supported?",
        answer:
          "This website can be displayed in Japanese and English. Supported languages for in-game and staff assistance are still being confirmed.",
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
    statusTitle: "Recruitment details are pending staff confirmation",
    statusDescription:
      "The site will not state that applications are open until recruitment status, permissions, duties, and requirements are confirmed.",
    items: [
      {
        id: "responsibilities",
        title: "Responsibilities",
        description:
          "Player support and reviewing rule violations are being considered, but the official scope of duties is still under review.",
        icon: "clipboard",
        status: "pending",
      },
      {
        id: "requirements",
        title: "Application Requirements",
        description:
          "Requirements such as activity level, age, and prior experience are pending staff confirmation.",
        icon: "user-check",
        status: "pending",
      },
      {
        id: "ideal-candidate",
        title: "Who We Are Looking For",
        description:
          "Responsibility, fairness, and consistency are priorities. Detailed selection criteria are still under review.",
        icon: "shield",
        status: "pending",
      },
    ],
    applicationTitle: "How to Apply",
    applicationDescription:
      "The application destination and process are pending staff confirmation. They will be published after an official Discord channel or form is verified.",
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
  finalCta: {
    eyebrow: "Join the Community",
    title: "Join Japan Hideaway Server",
    description:
      "Participation details, the latest information, and support guidance will be shared on Discord.",
    action: {
      id: "final-discord",
      label: "Join Discord",
      ariaLabel: "Join the Japan Hideaway Server Discord",
      destination: "discord",
    },
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
