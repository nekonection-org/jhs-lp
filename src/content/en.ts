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
      "A community server with designated raiding hours, designed to be enjoyable even when your playtime is limited. Specific hours and participation requirements will be published as they are confirmed.",
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
        title: "For Working Adults and Students",
        description:
          "We aim to build a community that is approachable even when players have limited time to play.",
        icon: "users",
        status: "confirmed",
      },
      {
        id: "community",
        title: "Community Server",
        description:
          "A Rust community server focused on creating a place where players can enjoy the game with confidence.",
        icon: "community",
        status: "confirmed",
      },
      {
        id: "raid-window",
        title: "Designated Raiding Hours",
        description:
          "Raiding hours will be set with everyday schedules in mind. The exact days and times are pending staff confirmation.",
        icon: "clock",
        status: "pending",
      },
      {
        id: "operations",
        title: "Operational Details Pending",
        description:
          "Exact values such as the team limit, wipe schedule, and game settings will be published after confirmation.",
        icon: "settings",
        status: "pending",
      },
    ],
    pendingNotice:
      "Exact numbers and schedules are pending staff confirmation. Unconfirmed information is not presented as final.",
  },
  rules: {
    id: "rules",
    eyebrow: "Rules",
    title: "Important Rules",
    description:
      "This page will provide a concise overview of the rules that matter most for a safe and welcoming experience.",
    noticeTitle: "Rule wording is under review",
    notice:
      "The following entries are planned topics. Until staff review is complete, do not treat them as final rules, including any schedules, limits, or enforcement details.",
    items: [
      {
        id: "raid-window",
        title: "Raiding Hours",
        description:
          "The official days and times for raiding, together with how activity outside those hours is handled, are under review.",
        icon: "clock",
        status: "pending",
        important: true,
      },
      {
        id: "team-size",
        title: "Team Size Limit",
        description:
          "The team size limit and the treatment of alliances or cooperative play are pending staff confirmation.",
        icon: "users",
        status: "pending",
        important: true,
      },
      {
        id: "fair-play",
        title: "Unfair Play and Exploits",
        description:
          "The prohibited scope and enforcement policy for cheats, glitches, and unauthorized tools are under review.",
        icon: "shield",
        status: "pending",
      },
      {
        id: "community-conduct",
        title: "Community Conduct",
        description:
          "Standards concerning abuse, discrimination, excessive taunting, and targeted attacks are under review.",
        icon: "message",
        status: "pending",
      },
      {
        id: "reporting",
        title: "Reporting Violations",
        description:
          "The reporting process, including whether to use F7 reports and what information to submit, is under review.",
        icon: "report",
        status: "pending",
      },
      {
        id: "rule-updates",
        title: "Rule Updates",
        description:
          "How rule changes will be announced and when they take effect are under review. Check the latest notice after publication.",
        icon: "refresh",
        status: "pending",
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
          "Beginner eligibility and the available level of support are pending staff confirmation. This answer will be updated once confirmed.",
        status: "pending",
      },
      {
        id: "wipe-schedule",
        question: "When does the server wipe?",
        answer:
          "The official wipe schedule, including the day and time, is pending staff confirmation.",
        status: "pending",
      },
      {
        id: "team-size",
        question: "What is the maximum team size?",
        answer:
          "The team size limit and conditions concerning cooperative play are pending staff confirmation.",
        status: "pending",
      },
      {
        id: "raid-window",
        question: "What are the designated raiding hours?",
        answer:
          "The server is intended to use designated raiding hours. The exact days, times, and treatment of activity outside those hours are pending confirmation.",
        status: "pending",
      },
      {
        id: "reporting",
        question: "How do I report a rule violation?",
        answer:
          "The official reporting process, including F7 reports and the required evidence or information, is under review.",
        status: "pending",
      },
      {
        id: "ban-inquiries",
        question: "How can I ask about a ban?",
        answer:
          "The contact channel, required information, and response policy are under review. Please use the official channel after it is published.",
        status: "pending",
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
