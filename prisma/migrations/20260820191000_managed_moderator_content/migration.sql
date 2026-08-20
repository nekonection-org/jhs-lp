-- Preserve the moderator recruitment content that previously lived in TypeScript.
INSERT INTO `managed_sections` (`id`, `version`, `created_at`, `updated_at`)
VALUES ('moderator', 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3));

INSERT INTO `managed_section_translations` (
  `managed_section_id`, `locale`, `content`, `created_at`, `updated_at`
) VALUES
(
  'moderator',
  'ja',
  CAST('{"id":"moderator","eyebrow":"Moderator Recruitment","title":"モデレーター募集","description":"コミュニティを公平かつ継続的に支えるモデレーターについてご案内します。","status":"pending","statusTitle":"募集内容は準備中です","statusDescription":"募集状況、権限、活動内容、応募条件が確定するまでお待ちください。","items":[{"id":"responsibilities","title":"主な活動内容","description":"プレイヤー対応やルール違反の確認などを想定していますが、正式な担当範囲は準備中です。","icon":"clipboard","status":"pending"},{"id":"requirements","title":"応募条件","description":"活動頻度、年齢、経験などを含む応募条件は準備中です。","icon":"user-check","status":"pending"},{"id":"ideal-candidate","title":"求める人物像","description":"責任、公平性、継続性を重視する方針です。具体的な選考基準は準備中です。","icon":"shield","status":"pending"}],"applicationTitle":"応募方法","applicationDescription":"応募先と受付方法は準備中です。正式なDiscordチャンネルまたはフォームの確認後に掲載します。","applicationAction":null}' AS JSON),
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
),
(
  'moderator',
  'en',
  CAST('{"id":"moderator","eyebrow":"Moderator Recruitment","title":"Moderator Recruitment","description":"Information about moderators who can support the community fairly and consistently.","status":"pending","statusTitle":"Recruitment details are in preparation","statusDescription":"Please wait until the recruitment status, permissions, duties, and requirements have been finalized.","items":[{"id":"responsibilities","title":"Responsibilities","description":"Player support and reviewing rule violations are being considered, but the official scope of duties is still in preparation.","icon":"clipboard","status":"pending"},{"id":"requirements","title":"Application Requirements","description":"Requirements such as activity level, age, and prior experience are in preparation.","icon":"user-check","status":"pending"},{"id":"ideal-candidate","title":"Who We Are Looking For","description":"Responsibility, fairness, and consistency are priorities. Detailed selection criteria are still in preparation.","icon":"shield","status":"pending"}],"applicationTitle":"How to Apply","applicationDescription":"The application destination and process are in preparation. They will be published after an official Discord channel or form is confirmed.","applicationAction":null}' AS JSON),
  CURRENT_TIMESTAMP(3),
  CURRENT_TIMESTAMP(3)
);
