#!/bin/sh

set -e

if ! nc -z "$MYSQL_HOST" 3306; then
    echo "MySQL host is not available!"
    exit 1
fi

# $BACKUPS_DIR_PATH and $BACKUP_NAME should be passed as envs for this script
# $BACKUPS_DIR_PATH - path to directory where to save backup
# $BACKUP_NAME     - backup name(like a file name without extension)
BACKUP_DIR_PATH="${BACKUPS_DIR_PATH}/${BACKUP_NAME}"
BACKUP_TMP_DIR_PATH="${BACKUP_DIR_PATH}/tmp"
BACKUP_ARCHIVE_PATH="${BACKUPS_DIR_PATH}/${BACKUP_NAME}.tar.gz"

mkdir -vp "$BACKUP_TMP_DIR_PATH"

cd "$BACKUP_TMP_DIR_PATH"

cp -vr "$STORAGE_DIR_PATH" .

# create Percona dump
mysqldump \
    -u "$MYSQL_USER" \
    -p"$MYSQL_PASSWORD" \
    --host="${MYSQL_HOST}" \
    "$MYSQL_DATABASE" | \
gpg \
    --output "${BACKUP_NAME}.sql.gpg" \
    --encrypt \
    --recipient "$ENCRYPT_KEYS_EMAIL" \
    --armor \
    --trust-model always

# rationale for the "-- *": https://github.com/koalaman/shellcheck/wiki/SC2035
tar -czvf "$BACKUP_ARCHIVE_PATH" -- *

rm -rf "$BACKUP_DIR_PATH"

if [ "$UPLOAD_BACKUPS_TO_DO" -eq 1 ]; then
    # run script to upload backup to the DigitalOcean
    DO_SPACE_FOLDER_TO_SAVE_FILE="$DO_SPACE_ROOT_PROJECT_FOLDER/$BACKUP_CYCLE" \
    "$WORKDIR_PATH/node-script/uploadBackup.js" \
    "$BACKUP_ARCHIVE_PATH"
fi
