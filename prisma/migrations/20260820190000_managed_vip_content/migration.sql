-- CreateTable
CREATE TABLE `managed_sections` (
    `id` VARCHAR(32) NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `managed_section_updated_at_idx`(`updated_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `managed_section_translations` (
    `managed_section_id` VARCHAR(32) NOT NULL,
    `locale` ENUM('ja', 'en') NOT NULL,
    `content` JSON NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`managed_section_id`, `locale`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `audit_logs`
  ADD COLUMN `managed_section_id` VARCHAR(32) NULL,
  ADD INDEX `audit_log_managed_section_idx`(`managed_section_id`, `created_at`);

-- AddForeignKey
ALTER TABLE `managed_section_translations`
  ADD CONSTRAINT `managed_section_translations_managed_section_id_fkey`
  FOREIGN KEY (`managed_section_id`) REFERENCES `managed_sections`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_managed_section_id_fkey`
  FOREIGN KEY (`managed_section_id`) REFERENCES `managed_sections`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve the VIP content that previously lived in TypeScript.
INSERT INTO `managed_sections` (`id`, `version`, `created_at`, `updated_at`)
VALUES ('vip', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `managed_section_translations` (
  `managed_section_id`, `locale`, `content`, `created_at`, `updated_at`
) VALUES
(
  'vip',
  'ja',
  CAST('{"id":"vip","eyebrow":"VIP","title":"VIP制度","description":"VIP制度の目的、実際に提供する特典、料金、購入方法を正確に案内するための準備を進めています。","status":"pending","statusTitle":"VIPは準備中です","statusDescription":"提供内容が確定するまで、特典や料金は掲載しません。","details":[{"id":"price","label":"料金","value":"未確定","status":"pending"},{"id":"duration","label":"有効期間","value":"未確定","status":"pending"},{"id":"purchase-method","label":"購入方法","value":"未確定","status":"pending"},{"id":"refund-policy","label":"返金・稼働方針","value":"購入後に利用期間が開始したVIPは、原則として返金いたしかねます。","status":"pending"}],"benefitsTitle":"VIP特典","benefits":[],"emptyBenefitsTitle":"確認済みの特典はまだ掲載されていません","emptyBenefitsDescription":"特典の内容は準備中です。提供内容が確定次第、最新の情報を掲載します。","purchaseAction":null,"purchaseUnavailableMessage":"購入ページは、提供内容と正式なTebex URLの確認後にご案内します。","notice":"VIPによるゲーム内の優位性は提供しません。VIPはコミュニティ運営の支援を目的とした制度であり、ゲーム内の特典は限定的です。特典内容は変更される場合があります。"}' AS JSON),
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
),
(
  'vip',
  'en',
  CAST('{"id":"vip","eyebrow":"VIP","title":"VIP Program","description":"We are preparing an accurate explanation of the VIP program, the benefits actually provided, pricing, and the purchase process.","status":"pending","statusTitle":"VIP is in preparation","statusDescription":"Benefits and pricing will not be published until the offering has been finalized.","details":[{"id":"price","label":"Price","value":"Not confirmed","status":"pending"},{"id":"duration","label":"Duration","value":"Not confirmed","status":"pending"},{"id":"purchase-method","label":"Purchase Method","value":"Not confirmed","status":"pending"},{"id":"refund-policy","label":"Refund and Service Availability","value":"As a general rule, VIP purchases cannot be refunded once the usage period has begun.","status":"pending"}],"benefitsTitle":"VIP Benefits","benefits":[],"emptyBenefitsTitle":"No confirmed benefits have been published yet","emptyBenefitsDescription":"VIP benefits are in preparation. The latest information will be published once the offering has been finalized.","purchaseAction":null,"purchaseUnavailableMessage":"The purchase page will be provided after the offering and official Tebex URL have been confirmed.","notice":"VIP does not provide an in-game competitive advantage. The program supports community operations, and any in-game benefits will remain limited. Benefits may change."}' AS JSON),
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
);
