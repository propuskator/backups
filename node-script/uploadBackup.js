#!/usr/bin/env node

const path           = require('path');
const fs             = require('fs/promises');
const uploadFile     = require('./lib/uploadFile');
const { initLogger } = require('./lib/extensions/Logger');

const logger         = initLogger();
const backupFilePath = process.argv[2];
const backupFileName = path.basename(backupFilePath);

logger.info('started upload file to DO');

fs // eslint-disable-line more/no-then
    .readFile(backupFilePath)
    .then(backup => uploadFile({ binary: backup, filename: backupFileName }))
    .then(() => logger.info('upload was finished'))
    .catch(error => logger.error(error.message));
