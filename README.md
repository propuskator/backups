# Access-backups

## Requirements
* GPG utility(https://gnupg.org/download/index.html)

## Generating GPG keys
The main thing needed for working backups service is a public GPG key.  
To generate a GPG keys execute the next command and choose the defaults:
```shell
gpg --full-generate-key
```

### Export public key
Enter next command to retrieve the ID of the key:
```shell
gpg --list-secret-keys --keyid-format=long
```
Find the group of rows with email entered for the key. Copy the ID, which placed in the next format:  
```
sec   <algorithm-name>/<target-key-id>
```
For example, the output is:
``` 
sec   ed25519/EC21B8F2164F7CBC 2021-06-14 [SC]  
      5C592E5DC3A2E49AECF91889EC21B8F2164F7CBC  
uid                 [ultimate] test-propuskator <test@test.com> 
ssb   cv25519/4EA340F0260DA003 2021-06-14 [E]
```
So, the ID is "EC21B8F2164F7CBC".  
Next, export the public key to the access-composer project keys directory:
```shell
gpg --armor --export <target-key-id> > /path/to/access-composer/system/keys/public_key.gpg
```

## Configuration
Configuration of backuping occurs via environment variables in .env file of **composer**. You need to put your GPG public key to access-composer/system/keys directory with the name specified in GPG_PUBLIC_KEY_FILENAME env.  
Description of environment variables: 
   - **ENCRYPT_KEYS_EMAIL** - this variable should contain the email that is related with public key
   - **BACKUP_DAILY** - option to enable creation of a daily backups. Possible values ('1' - is to enable, any other value to disable)
   - **BACKUP_WEEKLY** - option to enable creation of a weekly backups. Possible values ('1' - is to enable, any other value to disable)
   - **BACKUP_MONTHLY** - option to enable creation of a monthly backups. Possible values ('1' - is to enable, any other value to disable)
   - **UPLOAD_BACKUPS_TO_DO** - option to upload backups to the Digital Ocean

## Restoring

You need to extract backup archive to restore its content:
```shell
tar -xvf <backup-filename>.tar.gz
```

### Percona
Decrypt Percona dump to restore it.

Using gpg utility:
```shell
gpg --output <decrypted-dump-name>.sql --decrypt <encrypted-dump-name>.sql.gpg
```

For restoring decrypted Percona backups use following command and specify the path to the backup on your host machine
```shell
docker exec -i access-percona sh -c 'exec mysql -u $MYSQL_USER -p"$MYSQL_PASSWORD" $MYSQL_DATABASE' < /some/path/on/your/host/dump.sql
docker exec access-backend npm run reset-readers
```

### Backend storage

Move extracted storage directory to access-composer/system:
```shell
cp -R storage /path/to/your/access-composer/system
```

## Digital Ocean

If you wanna use DO for upload backups you should set all parameters to .env **access-composer** or .env.defaults

- DO_SPACE_ENDPOINT
- DO_SPACE_ACCESS_KEY_ID
- DO_SPACE_SECRET_ACCESS_KEY
- DO_SPACE_BUCKET
- DO_SPACE_ROOT_PROJECT_FOLDER

## Shell scripts

- **/scripts/backup.sh** The system will created backups, encrypt (see script "**/scripts/generateKeys.sh**") and upload (if **UPLOAD_BACKUPS_TO_DO** has value **1** and set all settings for Digital Ocean)
- **/scripts/getbackup.sh.sh** - The system get backups from Digital Ocean (if available) only need to set a date and time to get backups

For encrypt files system uses OpenPGP encrypt.
