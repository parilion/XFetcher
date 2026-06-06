ALTER TABLE `AihotItem`
    ADD COLUMN `isSelected` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isAll` BOOLEAN NOT NULL DEFAULT false;

UPDATE `AihotItem`
SET `isSelected` = true,
    `isAll` = true;

CREATE INDEX `AihotItem_isSelected_category_publishedAt_idx`
    ON `AihotItem`(`isSelected`, `category`, `publishedAt`);

CREATE INDEX `AihotItem_isAll_category_publishedAt_idx`
    ON `AihotItem`(`isAll`, `category`, `publishedAt`);
