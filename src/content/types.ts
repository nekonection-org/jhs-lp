export const locales = ["ja", "en"] as const;

export type Locale = (typeof locales)[number];

export const sectionIds = [
  "top",
  "server",
  "rules",
  "vip",
  "faq",
  "moderator",
  "news",
] as const;

export type SectionId = (typeof sectionIds)[number];
export type NavigableSectionId = Exclude<SectionId, "top">;
export type SectionHref = `#${SectionId}`;

export const navigationItemIds = [
  "server",
  "rules",
  "vip",
  "faq",
  "moderator",
  "news",
] as const satisfies readonly NavigableSectionId[];

export const serverFeatureIds = [
  "audience",
  "community",
  "raid-window",
  "operations",
] as const;

export const ruleItemIds = [
  "raid-window",
  "team-size",
  "fair-play",
  "community-conduct",
  "reporting",
  "rule-updates",
] as const;

export const vipDetailIds = [
  "price",
  "duration",
  "purchase-method",
  "refund-policy",
] as const;

export const faqItemIds = [
  "joining",
  "beginners",
  "ban-inquiries",
  "vip-purchase",
  "language-support",
  "about-streaming",
] as const;

export const moderatorDetailIds = [
  "responsibilities",
  "requirements",
  "ideal-candidate",
] as const;

export type ContentStatus = "confirmed" | "pending";
export type ExternalDestination = "discord" | "tebex" | "moderatorApplication";
export type NewsCategory =
  "notice" | "maintenance" | "update" | "event" | "important" | "incident";

export type ContentIcon =
  | "users"
  | "community"
  | "clock"
  | "settings"
  | "shield"
  | "message"
  | "report"
  | "refresh"
  | "calendar"
  | "credit-card"
  | "badge"
  | "clipboard"
  | "user-check";

type IdentifiedItems<Ids extends readonly string[], Fields extends object> = {
  readonly [Index in keyof Ids]: Fields & { readonly id: Ids[Index] };
};

export interface MetadataContent {
  readonly title: string;
  readonly description: string;
  readonly openGraphImageAlt: string;
}

export interface CommonContent {
  readonly siteName: string;
  readonly skipToContent: string;
  readonly joinDiscord: string;
  readonly externalLink: string;
  readonly opensInNewTab: string;
  readonly learnMore: string;
  readonly backToTop: string;
  readonly unavailable: string;
  readonly pendingConfirmation: string;
  readonly statusLabels: Readonly<Record<ContentStatus, string>>;
}

export interface ThemeContent {
  readonly label: string;
  readonly dark: string;
  readonly light: string;
  readonly currentTheme: string;
  readonly switchToDark: string;
  readonly switchToLight: string;
}

export interface LanguageContent {
  readonly label: string;
  readonly japanese: string;
  readonly english: string;
  readonly currentLanguage: string;
  readonly switchToJapanese: string;
  readonly switchToEnglish: string;
}

export type NavigationItems = IdentifiedItems<
  typeof navigationItemIds,
  { readonly label: string }
>;

export interface NavigationContent {
  readonly ariaLabel: string;
  readonly homeLabel: string;
  readonly openMenu: string;
  readonly closeMenu: string;
  readonly mobileMenuLabel: string;
  readonly items: NavigationItems;
  readonly discordAction: ExternalActionContent;
}

export interface ExternalActionContent {
  readonly id: string;
  readonly label: string;
  readonly ariaLabel: string;
  readonly destination: ExternalDestination;
}

export interface SectionActionContent {
  readonly id: string;
  readonly label: string;
  readonly ariaLabel: string;
  readonly destination: SectionId;
}

export interface HeroContent {
  readonly id: "top";
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  readonly primaryAction: ExternalActionContent;
  readonly secondaryAction: SectionActionContent;
  readonly backgroundAlt: string;
  readonly connection: {
    readonly title: string;
    readonly description: string;
    readonly commandLabel: string;
    readonly copyLabel: string;
    readonly copiedLabel: string;
    readonly copyErrorLabel: string;
    readonly steamLabel: string;
    readonly steamAriaLabel: string;
    readonly unavailable: string;
  };
}

export interface SectionIntroduction<Id extends SectionId> {
  readonly id: Id;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
}

export type ServerFeatureItems = IdentifiedItems<
  typeof serverFeatureIds,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: ContentIcon;
    readonly status: ContentStatus;
  }
>;

export interface ServerContent extends SectionIntroduction<"server"> {
  readonly items: ServerFeatureItems;
  readonly pendingNotice: string;
}

export type RuleItems = IdentifiedItems<
  typeof ruleItemIds,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: ContentIcon;
    readonly status: ContentStatus;
    readonly important?: boolean;
  }
>;

export interface RulesContent extends SectionIntroduction<"rules"> {
  readonly noticeTitle: string;
  readonly notice: string;
  readonly items: RuleItems;
}

export type VipDetailItems = IdentifiedItems<
  typeof vipDetailIds,
  {
    readonly label: string;
    readonly value: string;
    readonly status: ContentStatus;
  }
>;

export interface VipBenefit {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon?: ContentIcon;
}

export interface VipContent extends SectionIntroduction<"vip"> {
  readonly status: ContentStatus;
  readonly statusTitle: string;
  readonly statusDescription: string;
  readonly details: VipDetailItems;
  readonly benefitsTitle: string;
  readonly benefits: readonly VipBenefit[];
  readonly emptyBenefitsTitle: string;
  readonly emptyBenefitsDescription: string;
  readonly purchaseAction: ExternalActionContent | null;
  readonly purchaseUnavailableMessage: string;
  readonly notice: string;
}

export type FaqItems = IdentifiedItems<
  typeof faqItemIds,
  {
    readonly question: string;
    readonly answer: string;
    readonly status: ContentStatus;
  }
>;

export interface FaqContent extends SectionIntroduction<"faq"> {
  readonly items: FaqItems;
}

export type ModeratorDetailItems = IdentifiedItems<
  typeof moderatorDetailIds,
  {
    readonly title: string;
    readonly description: string;
    readonly icon: ContentIcon;
    readonly status: ContentStatus;
  }
>;

export interface ModeratorContent extends SectionIntroduction<"moderator"> {
  readonly status: ContentStatus;
  readonly statusTitle: string;
  readonly statusDescription: string;
  readonly items: ModeratorDetailItems;
  readonly applicationTitle: string;
  readonly applicationDescription: string;
  readonly applicationAction: ExternalActionContent | null;
}

export interface NewsItem {
  readonly id: string;
  readonly publishedAt: string;
  readonly category: NewsCategory;
  readonly title: string;
  readonly description: string;
  readonly url?: string;
}

export interface NewsContent extends SectionIntroduction<"news"> {
  readonly categoryLabels: Readonly<Record<NewsCategory, string>>;
  readonly items: readonly NewsItem[];
  readonly emptyTitle: string;
  readonly emptyDescription: string;
}

export interface TermsArticleContent {
  readonly id: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly items?: readonly string[];
}

export interface TermsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly openLabel: string;
  readonly closeLabel: string;
  readonly dialogLabel: string;
  readonly introduction: readonly string[];
  readonly articles: readonly TermsArticleContent[];
  readonly supplementaryNote: string;
  readonly lastUpdatedLabel: string;
  readonly lastUpdated: string;
}

export interface FooterContent {
  readonly ariaLabel: string;
  readonly description: string;
  readonly communityDisclaimer: string;
  readonly navigationLabel: string;
  readonly backToTopLabel: string;
  readonly copyrightName: string;
}

export interface SiteContent {
  readonly locale: Locale;
  readonly metadata: MetadataContent;
  readonly common: CommonContent;
  readonly theme: ThemeContent;
  readonly language: LanguageContent;
  readonly navigation: NavigationContent;
  readonly hero: HeroContent;
  readonly server: ServerContent;
  readonly rules: RulesContent;
  readonly vip: VipContent;
  readonly faq: FaqContent;
  readonly moderator: ModeratorContent;
  readonly news: NewsContent;
  readonly terms: TermsContent;
  readonly footer: FooterContent;
}
