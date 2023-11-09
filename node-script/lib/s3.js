const AWS = require('aws-sdk');
const {
    ENDPOINT,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY
} = require('./config');

const spacesEndpoint = new AWS.Endpoint(ENDPOINT);
const s3provider = new AWS.S3({
    endpoint        : spacesEndpoint,
    accessKeyId     : ACCESS_KEY_ID,
    secretAccessKey : SECRET_ACCESS_KEY
});

module.exports = s3provider;
