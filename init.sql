CREATE DATABASE IF NOT EXISTS `xfetcher`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `xfetcher`;

CREATE TABLE IF NOT EXISTS `AccountGroup` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL DEFAULT '',
    `defaultFetchInterval` INTEGER NOT NULL DEFAULT 300,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `AccountGroup_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `SourceAccount` (
    `id` VARCHAR(191) NOT NULL,
    `xHandle` VARCHAR(191) NOT NULL,
    `displayName` VARCHAR(191) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `groupId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `SourceAccount_xHandle_key`(`xHandle`),
    INDEX `SourceAccount_groupId_idx`(`groupId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `RawPost` (
    `id` VARCHAR(191) NOT NULL,
    `sourceAccountId` VARCHAR(191) NOT NULL,
    `externalPostId` VARCHAR(191) NOT NULL,
    `originalText` VARCHAR(191) NOT NULL,
    `originalLanguage` VARCHAR(191) NOT NULL,
    `postedAt` DATETIME(3) NOT NULL,
    `fetchedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sourceType` VARCHAR(191) NOT NULL,
    `rawPayload` JSON NOT NULL,

    INDEX `RawPost_sourceAccountId_idx`(`sourceAccountId`),
    UNIQUE INDEX `RawPost_sourceAccountId_externalPostId_key`(`sourceAccountId`, `externalPostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `PostTranslation` (
    `id` VARCHAR(191) NOT NULL,
    `rawPostId` VARCHAR(191) NOT NULL,
    `translatedTextZh` VARCHAR(191) NOT NULL DEFAULT '',
    `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
    `errorMessage` VARCHAR(191) NOT NULL DEFAULT '',
    `modelName` VARCHAR(191) NOT NULL DEFAULT 'mock-translator',
    `modelVersion` VARCHAR(191) NOT NULL DEFAULT 'v1',
    `translatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `PostTranslation_rawPostId_key`(`rawPostId`),
    INDEX `PostTranslation_rawPostId_idx`(`rawPostId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `CrawlRun` (
    `id` VARCHAR(191) NOT NULL,
    `sourceAccountId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `fetchedCount` INTEGER NOT NULL DEFAULT 0,
    `insertedCount` INTEGER NOT NULL DEFAULT 0,
    `failedCount` INTEGER NOT NULL DEFAULT 0,
    `proxySessionIdentifier` VARCHAR(191) NOT NULL DEFAULT '',
    `errorSummary` VARCHAR(191) NOT NULL DEFAULT '',
    `startedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishedAt` DATETIME(3) NULL,

    INDEX `CrawlRun_sourceAccountId_idx`(`sourceAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `AihotItem` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(512) NOT NULL,
    `titleEn` VARCHAR(512) NULL,
    `url` VARCHAR(2048) NOT NULL,
    `source` VARCHAR(512) NOT NULL,
    `publishedAt` DATETIME(3) NULL,
    `summary` TEXT NULL,
    `category` VARCHAR(64) NULL,
    `isSelected` BOOLEAN NOT NULL DEFAULT false,
    `rawPayload` JSON NOT NULL,
    `firstSeenAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `lastSeenAt` DATETIME(3) NOT NULL,

    INDEX `AihotItem_isSelected_category_publishedAt_idx`(`isSelected`, `category`, `publishedAt`),
    INDEX `AihotItem_category_publishedAt_idx`(`category`, `publishedAt`),
    INDEX `AihotItem_publishedAt_idx`(`publishedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

SET @constraint_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'SourceAccount'
    AND CONSTRAINT_NAME = 'SourceAccount_groupId_fkey'
);
SET @sql := IF(
  @constraint_exists = 0,
  'ALTER TABLE `SourceAccount` ADD CONSTRAINT `SourceAccount_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `AccountGroup`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @constraint_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'RawPost'
    AND CONSTRAINT_NAME = 'RawPost_sourceAccountId_fkey'
);
SET @sql := IF(
  @constraint_exists = 0,
  'ALTER TABLE `RawPost` ADD CONSTRAINT `RawPost_sourceAccountId_fkey` FOREIGN KEY (`sourceAccountId`) REFERENCES `SourceAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @constraint_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'PostTranslation'
    AND CONSTRAINT_NAME = 'PostTranslation_rawPostId_fkey'
);
SET @sql := IF(
  @constraint_exists = 0,
  'ALTER TABLE `PostTranslation` ADD CONSTRAINT `PostTranslation_rawPostId_fkey` FOREIGN KEY (`rawPostId`) REFERENCES `RawPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @constraint_exists := (
  SELECT COUNT(*)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'CrawlRun'
    AND CONSTRAINT_NAME = 'CrawlRun_sourceAccountId_fkey'
);
SET @sql := IF(
  @constraint_exists = 0,
  'ALTER TABLE `CrawlRun` ADD CONSTRAINT `CrawlRun_sourceAccountId_fkey` FOREIGN KEY (`sourceAccountId`) REFERENCES `SourceAccount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE',
  'SELECT 1'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
