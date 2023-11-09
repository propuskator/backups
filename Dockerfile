FROM node:14.16-alpine

ENV WORKDIR_PATH /app

WORKDIR $WORKDIR_PATH

RUN apk update && apk add --no-cache \
    gnupg \
    mysql-client \
    tzdata

COPY node-script/ node-script/
RUN npm install --prefix node-script/

COPY scripts/ scripts/
COPY start.sh start.sh

RUN chmod +x start.sh scripts/*

# path to the script for creating backups
ENV BACKUP_SCRIPT_PATH $WORKDIR_PATH/scripts/backup.sh
# path to the script for removing old backups
ENV BACKUP_CLEAN_SCRIPT_PATH $WORKDIR_PATH/scripts/clean.sh

ENTRYPOINT [ "./start.sh" ]
