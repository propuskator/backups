const fs                         = require('fs').promises;
const s3provider                 = require('./s3');
const { BUCKET, FOLDER_TO_SAVE } = require('./config');
const { initLogger, LEVELS }     = require('./extensions/Logger');

const logger     = initLogger();

/**
 * @param {string} path
 * @param {string} filename
 * @returns
 */
async function uploadFile({ path = null, filename, binary = null }) {
    try {
        let data;

        if (path) {
            data = await fs.readFile(`${path}/${filename}`);
        } else if (binary) {
            data = binary;
        }

        const params = {
            Bucket : BUCKET,
            Key    : `${FOLDER_TO_SAVE}/${filename}`,
            ACL    : 'private',
            Body   : data
        };

        return await s3provider.putObject(params).promise();
    } catch (error) {
        logger.log({
            level   : LEVELS.ERROR,
            message : error.message
        });
    }
}

module.exports = uploadFile;
