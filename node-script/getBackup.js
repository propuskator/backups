#!/usr/bin/env node

const path                                              = require('path');
const fs                                                = require('fs/promises');
const prompt                                            = require('prompt');
const getFilesFromDO                                    = require('./lib/getFilesFromDO');
const s3provider                                        = require('./lib/s3');
const { initLogger }                                    = require('./lib/extensions/Logger');
const { BUCKET, BACKUPS_DIR_PATH, ROOT_PROJECT_FOLDER } = require('./lib/config');

const logger     = initLogger();
const properties = [
    {
        description : 'Enter the backup cycle(daily|weekly|monthly)',
        name        : 'backupCycle',
        validator   : /^(daily|weekly|monthly)$/,
        warning     : 'Possible values: daily, weekly, monthly',
        required    : true
    },
    {
        description : 'Enter the backup filename',
        name        : 'backupFilename',
        required    : true
    }
];

(async () => {
    prompt.start();

    const { backupCycle, backupFilename } = await prompt.get(properties);
    const folderPath = path.join(ROOT_PROJECT_FOLDER, backupCycle, '/');
    const files = await getFilesFromDO(folderPath);
    const targetFile = files.find(file => path.basename(file.Key) === backupFilename);

    if (!targetFile) {
        logger.info(`File "${backupFilename}" was not found in the folder "${folderPath}"`);

        process.exit(1);
    }

    const downloadedBackup = await s3provider.getObject({ Bucket: BUCKET, Key: targetFile.Key }).promise();
    const downloadedBackupPath = path.join(BACKUPS_DIR_PATH, backupCycle, backupFilename);

    await fs.writeFile(downloadedBackupPath, downloadedBackup.Body);

    logger.info(`File "${backupFilename}" was successfully downloaded and saved to "${downloadedBackupPath}"`);
})();
