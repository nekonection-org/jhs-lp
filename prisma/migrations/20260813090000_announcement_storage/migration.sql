-- CreateTable
CREATE TABLE `announcements` (
    `id` CHAR(36) NOT NULL,
    `category` ENUM('notice', 'maintenance', 'update', 'event', 'important', 'incident') NOT NULL,
    `status` ENUM('draft', 'published', 'archived') NOT NULL DEFAULT 'draft',
    `published_at` DATETIME(3) NULL,
    `external_url` VARCHAR(2048) NULL,
    `version` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    CONSTRAINT `announcements_published_at_check`
      CHECK (`status` <> 'published' OR `published_at` IS NOT NULL),
    INDEX `announcement_publication_idx`(`status`, `published_at`),
    INDEX `announcement_updated_at_idx`(`updated_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `announcement_translations` (
    `announcement_id` CHAR(36) NOT NULL,
    `locale` ENUM('ja', 'en') NOT NULL,
    `title` VARCHAR(160) NOT NULL,
    `description` VARCHAR(600) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`announcement_id`, `locale`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` CHAR(36) NOT NULL,
    `announcement_id` CHAR(36) NULL,
    `action` ENUM('create', 'update', 'archive') NOT NULL,
    `actor_sub` VARCHAR(255) NOT NULL,
    `actor_email` VARCHAR(320) NOT NULL,
    `request_id` VARCHAR(128) NULL,
    `before_data` JSON NULL,
    `after_data` JSON NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_log_created_at_idx`(`created_at`),
    INDEX `audit_log_announcement_idx`(`announcement_id`, `created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `announcement_translations`
  ADD CONSTRAINT `announcement_translations_announcement_id_fkey`
  FOREIGN KEY (`announcement_id`) REFERENCES `announcements`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_announcement_id_fkey`
  FOREIGN KEY (`announcement_id`) REFERENCES `announcements`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

-- Preserve the verified announcement that previously lived in TypeScript.
INSERT INTO `announcements` (
  `id`, `category`, `status`, `published_at`, `version`, `created_at`, `updated_at`
) VALUES (
  'd4e01c44-e829-4bb5-93c8-ffae42c0a106',
  'notice',
  'published',
  '2026-08-06 00:00:00.000',
  1,
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
);

INSERT INTO `announcement_translations` (
  `announcement_id`, `locale`, `title`, `description`, `created_at`, `updated_at`
) VALUES
  (
    'd4e01c44-e829-4bb5-93c8-ffae42c0a106',
    'ja',
    '公式Webサイトを公開',
    'Japan Hideaway Serverの公式Webサイトを公開しました。',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  ),
  (
    'd4e01c44-e829-4bb5-93c8-ffae42c0a106',
    'en',
    'Official Website Launch',
    'The official website for Japan Hideaway Server is now live.',
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
  );
