-- Rename the original seeded content while preserving administrator edits and audit history.
START TRANSACTION;

UPDATE `managed_sections` AS section
SET `version` = `version` + 1, `updated_at` = CURRENT_TIMESTAMP(3)
WHERE section.`id` = 'rules'
  AND EXISTS (
    SELECT 1 FROM `managed_section_translations` AS translation
    WHERE translation.`managed_section_id` = section.`id`
      AND (
        (translation.`locale` = 'ja' AND JSON_UNQUOTE(JSON_EXTRACT(translation.`content`, '$.rulebook.title')) = 'Japan Hideaway Server サーバールール')
        OR (translation.`locale` = 'en' AND JSON_UNQUOTE(JSON_EXTRACT(translation.`content`, '$.rulebook.title')) = 'Japan Hideaway Server Rules')
      )
  );

UPDATE `managed_section_translations`
SET `content` = JSON_SET(
      `content`, '$.rulebook.title',
      CASE `locale`
        WHEN 'ja' THEN 'JapanHideaway.com サーバールール'
        WHEN 'en' THEN 'JapanHideaway.com Rules'
      END
    ),
    `updated_at` = CURRENT_TIMESTAMP(3)
WHERE `managed_section_id` = 'rules'
  AND (
    (`locale` = 'ja' AND JSON_UNQUOTE(JSON_EXTRACT(`content`, '$.rulebook.title')) = 'Japan Hideaway Server サーバールール')
    OR (`locale` = 'en' AND JSON_UNQUOTE(JSON_EXTRACT(`content`, '$.rulebook.title')) = 'Japan Hideaway Server Rules')
  );

UPDATE `announcements` AS announcement
SET `version` = `version` + 1, `updated_at` = CURRENT_TIMESTAMP(3)
WHERE announcement.`id` = 'd4e01c44-e829-4bb5-93c8-ffae42c0a106'
  AND EXISTS (
    SELECT 1 FROM `announcement_translations` AS translation
    WHERE translation.`announcement_id` = announcement.`id`
      AND (
        (translation.`locale` = 'ja' AND translation.`description` = 'Japan Hideaway Serverの公式Webサイトを公開しました。')
        OR (translation.`locale` = 'en' AND translation.`description` = 'The official website for Japan Hideaway Server is now live.')
      )
  );

UPDATE `announcement_translations`
SET `description` = CASE `locale`
      WHEN 'ja' THEN 'JapanHideaway.comの公式Webサイトを公開しました。'
      WHEN 'en' THEN 'The official website for JapanHideaway.com is now live.'
    END,
    `updated_at` = CURRENT_TIMESTAMP(3)
WHERE `announcement_id` = 'd4e01c44-e829-4bb5-93c8-ffae42c0a106'
  AND (
    (`locale` = 'ja' AND `description` = 'Japan Hideaway Serverの公式Webサイトを公開しました。')
    OR (`locale` = 'en' AND `description` = 'The official website for Japan Hideaway Server is now live.')
  );

COMMIT;
