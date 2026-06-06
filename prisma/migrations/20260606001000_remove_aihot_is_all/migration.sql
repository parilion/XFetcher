DROP INDEX `AihotItem_isAll_category_publishedAt_idx` ON `AihotItem`;

ALTER TABLE `AihotItem`
    DROP COLUMN `isAll`;
