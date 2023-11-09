const setDefaultValuesForEmptyEnvs = require('./setDefaultValuesForEmptyEnvs');

setDefaultValuesForEmptyEnvs();

const ENDPOINT = process.env.DO_SPACE_ENDPOINT;
const ACCESS_KEY_ID = process.env.DO_SPACE_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.DO_SPACE_SECRET_ACCESS_KEY;
const BUCKET = process.env.DO_SPACE_BUCKET;
const ROOT_PROJECT_FOLDER = process.env.DO_SPACE_ROOT_PROJECT_FOLDER;
const FOLDER_TO_SAVE = process.env.DO_SPACE_FOLDER_TO_SAVE_FILE;
const ENCRYPT_KEYS_EMAIL = process.env.ENCRYPT_KEYS_EMAIL;
const ENCRYPT_KEYS_SECRET_PHRASE = process.env.ENCRYPT_KEYS_SECRET_PHRASE;
const PUBLIC_KEY_NAME = 'public.key.gpg';
const PRIVATE_KEY_NAME = 'private.key.gpg';
const REVOCATION_CERTIFICATE_NAME = 'revocationcertificate.gpg';
const ENCRYPT_KEYS_FOLDER = process.env.ENCRYPT_KEYS_FOLDER;
const BACKUPS_DIR_PATH = process.env.BACKUPS_DIR_PATH;

module.exports = {
    ENDPOINT,
    ACCESS_KEY_ID,
    SECRET_ACCESS_KEY,
    BUCKET,
    ROOT_PROJECT_FOLDER,
    FOLDER_TO_SAVE,
    ENCRYPT_KEYS_EMAIL,
    ENCRYPT_KEYS_SECRET_PHRASE,
    PUBLIC_KEY_NAME,
    PRIVATE_KEY_NAME,
    REVOCATION_CERTIFICATE_NAME,
    ENCRYPT_KEYS_FOLDER,
    BACKUPS_DIR_PATH
};
