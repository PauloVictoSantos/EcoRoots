-- CreateTable
CREATE TABLE `sensor_data` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `temperature` DOUBLE NOT NULL,
    `humidity` DOUBLE NOT NULL,
    `soilMoisture` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NULL,
    `sizeBytes` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sensorDataId` INTEGER NOT NULL,

    UNIQUE INDEX `images_sensorDataId_key`(`sensorDataId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `analyses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `plant` VARCHAR(191) NOT NULL DEFAULT 'Unknown',
    `hasPest` BOOLEAN NOT NULL DEFAULT false,
    `pestType` VARCHAR(191) NULL,
    `hasDisease` BOOLEAN NOT NULL DEFAULT false,
    `diseaseType` VARCHAR(191) NULL,
    `damageType` VARCHAR(191) NOT NULL DEFAULT 'none',
    `severity` VARCHAR(191) NOT NULL DEFAULT 'low',
    `confidence` DOUBLE NOT NULL DEFAULT 0,
    `leafCondition` VARCHAR(191) NOT NULL DEFAULT 'healthy',
    `riskLevel` VARCHAR(191) NOT NULL DEFAULT 'low',
    `urgencyDays` INTEGER NOT NULL DEFAULT 7,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `imageId` INTEGER NOT NULL,

    UNIQUE INDEX `analyses_imageId_key`(`imageId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `insights` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `summary` TEXT NOT NULL,
    `recommendations` JSON NOT NULL,
    `riskLevel` VARCHAR(191) NOT NULL,
    `urgencyDays` INTEGER NOT NULL,
    `estimatedLoss` VARCHAR(191) NOT NULL,
    `irrigationRecommendation` BOOLEAN NOT NULL DEFAULT true,
    `alert` VARCHAR(191) NOT NULL DEFAULT 'none',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `analysisId` INTEGER NOT NULL,

    UNIQUE INDEX `insights_analysisId_key`(`analysisId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_sensorDataId_fkey` FOREIGN KEY (`sensorDataId`) REFERENCES `sensor_data`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `analyses` ADD CONSTRAINT `analyses_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `images`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `insights` ADD CONSTRAINT `insights_analysisId_fkey` FOREIGN KEY (`analysisId`) REFERENCES `analyses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
