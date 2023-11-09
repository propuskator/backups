#!/bin/sh

set -e

GPG_PUBLIC_KEY_PATH="${ENCRYPT_KEYS_FOLDER}/${GPG_PUBLIC_KEY_FILENAME}"

gpg --import "$GPG_PUBLIC_KEY_PATH"

# export envs to use it for the cron jobs, defined in the crontab
export DAILY_BACKUP_DIR_PATH="${BACKUPS_DIR_PATH}/daily"
export WEEKLY_BACKUP_DIR_PATH="${BACKUPS_DIR_PATH}/weekly"
export MONTHLY_BACKUP_DIR_PATH="${BACKUPS_DIR_PATH}/monthly"

mkdir -vp \
    "$DAILY_BACKUP_DIR_PATH" \
    "$WEEKLY_BACKUP_DIR_PATH" \
    "$MONTHLY_BACKUP_DIR_PATH"

# create crontab file and write jobs to it, use Grandfather-father-son(GFS) backup rotation scheme
# link with description: https://en.wikipedia.org/wiki/Backup_rotation_scheme#Grandfather-father-son
# create gaps for pretty look of crontab
if [ "$BACKUP_DAILY" = "1" ]; then
    cat <<'EOF' >> /crontab
@daily    BACKUPS_DIR_PATH="${DAILY_BACKUP_DIR_PATH}"   BACKUP_CYCLE=daily   BACKUP_NAME="dump_$(date +%-u)"                    $BACKUP_SCRIPT_PATH
EOF
fi

if [ "$BACKUP_WEEKLY" = "1" ]; then
    cat <<'EOF' >> /crontab
@weekly   BACKUPS_DIR_PATH="${WEEKLY_BACKUP_DIR_PATH}"  BACKUP_CYCLE=weekly  BACKUP_NAME="dump_$((($(date +%-d) - 1) / 7 + 1))" $BACKUP_SCRIPT_PATH
EOF
fi

if [ "$BACKUP_MONTHLY" = "1" ]; then
    cat <<'EOF' >> /crontab
@monthly  BACKUPS_DIR_PATH="${MONTHLY_BACKUP_DIR_PATH}" BACKUP_CYCLE=monthly BACKUP_NAME="dump_$(date +%-m)"                    $BACKUP_SCRIPT_PATH
EOF
fi

# create cron job to remove old backups
cat <<EOF >> /crontab
* * * * * $BACKUP_CLEAN_SCRIPT_PATH
EOF

/usr/bin/crontab /crontab # specify the crontab file for the cron daemon

# start cron daemon
/usr/sbin/crond -f -l 8 # set log level to 8(default)
