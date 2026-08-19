-- CreateTable
CREATE TABLE `faq_items` (
    `id` CHAR(36) NOT NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `content_status` ENUM('confirmed', 'pending') NOT NULL DEFAULT 'confirmed',
    `sort_order` INTEGER NOT NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `faq_publication_order_idx`(`status`, `sort_order`),
    INDEX `faq_updated_at_idx`(`updated_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `faq_translations` (
    `faq_item_id` CHAR(36) NOT NULL,
    `locale` ENUM('ja', 'en') NOT NULL,
    `question` VARCHAR(240) NOT NULL,
    `answer` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`faq_item_id`, `locale`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `audit_logs`
  ADD COLUMN `faq_item_id` CHAR(36) NULL,
  ADD INDEX `audit_log_faq_item_idx`(`faq_item_id`, `created_at`);

-- AddForeignKey
ALTER TABLE `faq_translations`
  ADD CONSTRAINT `faq_translations_faq_item_id_fkey`
  FOREIGN KEY (`faq_item_id`) REFERENCES `faq_items`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_faq_item_id_fkey`
  FOREIGN KEY (`faq_item_id`) REFERENCES `faq_items`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve the FAQ entries that previously lived in TypeScript.
INSERT INTO `faq_items` (
  `id`, `status`, `content_status`, `sort_order`, `version`, `created_at`, `updated_at`
) VALUES
  ('2d0f86dd-c8ab-4f2b-9a4a-658521298b10', 'published', 'confirmed', 10, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('0cb9a574-593f-4469-90d7-9699c4360bb2', 'published', 'confirmed', 20, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('bd1142e4-34ac-4271-b52d-c4679db4be21', 'published', 'pending', 30, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('57bdfe68-7d42-45b5-aaed-b950f20f615e', 'published', 'confirmed', 40, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)),
  ('7d419d54-fd7e-4ae7-8413-8d07dd571772', 'published', 'confirmed', 50, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `faq_translations` (
  `faq_item_id`, `locale`, `question`, `answer`, `created_at`, `updated_at`
) VALUES
  (
    '2d0f86dd-c8ab-4f2b-9a4a-658521298b10',
    'ja',
    'Rust初心者でも参加できますか？',
    '参加できます。限られた時間でも遊びやすく、初心者にも配慮したルールを設けています。プレイヤーの皆さまも初心者へできる限り優しく接してください。',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    '2d0f86dd-c8ab-4f2b-9a4a-658521298b10',
    'en',
    'Can Rust beginners join?',
    'Yes. The rules are designed to make the server approachable for players with limited time and for beginners. Players are also asked to be as welcoming to beginners as possible.',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    '0cb9a574-593f-4469-90d7-9699c4360bb2',
    'ja',
    'BANについて問い合わせる方法はありますか？',
    'チート・グリッチ・不正ツールに関する処分への異議申し立ては、Discordの#claim-ticketから受け付けます。',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    '0cb9a574-593f-4469-90d7-9699c4360bb2',
    'en',
    'How can I ask about a ban?',
    'Appeals concerning penalties for cheats, glitches, or unauthorized tools are accepted through the Discord #claim-ticket channel.',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    'bd1142e4-34ac-4271-b52d-c4679db4be21',
    'ja',
    'VIPはどこで購入できますか？',
    'VIPの提供内容、料金、正式な購入ページは準備中です。',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    'bd1142e4-34ac-4271-b52d-c4679db4be21',
    'en',
    'Where can I purchase VIP?',
    'The VIP offering, pricing, and official purchase page are in preparation. No purchase destination is currently published here.',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    '57bdfe68-7d42-45b5-aaed-b950f20f615e',
    'ja',
    '日本語以外にも対応していますか？',
    'このサイトは日本語と英語で表示できます。ゲーム内および運営サポートの対応言語は日本語です。他言語は翻訳ツールの利用をしています。',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    '57bdfe68-7d42-45b5-aaed-b950f20f615e',
    'en',
    'Are languages other than Japanese supported?',
    'This website can be displayed in Japanese and English. In-game and staff support is provided in Japanese; translation tools are used for other languages.',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    '7d419d54-fd7e-4ae7-8413-8d07dd571772',
    'ja',
    '配信や動画投稿は可能ですか？',
    '配信や動画投稿は可能です。Facepunch 利用規約および RUST の配信ルールに則して行ってください。',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    '7d419d54-fd7e-4ae7-8413-8d07dd571772',
    'en',
    'Is streaming or video posting allowed?',
    'Streaming and video posting are allowed. Please follow Facepunch''s Terms of Service and Rust''s streaming rules.',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  );
