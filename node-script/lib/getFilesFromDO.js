const s3provider = require('./s3');
const { BUCKET } = require('./config');

async function getFilesFromDo(folderPath) {
    const params = {
        Bucket    : BUCKET,
        Delimiter : '/',
        Prefix    : folderPath
    };

    const { Contents } = await s3provider.listObjects(params).promise();

    return Contents;
}

module.exports = getFilesFromDo;

