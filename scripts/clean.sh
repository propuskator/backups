#!/bin/sh

set -e

# remove backups older the BACKUPS_LIFE_DAYS days
find "${BACKUPS_DIR_PATH}" -mtime +$((BACKUPS_LIFE_DAYS - 1)) -type f -delete
