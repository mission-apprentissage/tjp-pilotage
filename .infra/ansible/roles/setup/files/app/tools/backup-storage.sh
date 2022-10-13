#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly BACKUP_NAS_DIR="/mnt/backups/mongodb"
readonly BACKUP_LOCAL_DIR="/opt/pilotage/backups/mongodb"
readonly BACKUP_FILE="${BACKUP_LOCAL_DIR}/mongodb-$(date +'%Y-%m-%d_%H%M%S').gpg"

function backup() {
  echo "Creating backup..."
  mkdir -p "${BACKUP_LOCAL_DIR}"
  # bash /opt/pilotage/server-yarn.sh zipStorage | bash "${SCRIPT_DIR}/gpg/encrypt.sh" >"${BACKUP_FILE}"
  docker exec pilotage_mongodb bash -c "mongodump --gzip --archive -u backup -p {{ vault[env_type].PILOTAGE_MONGODB_BACKUP_PASSWORD }}" \
  | bash "${SCRIPT_DIR}/gpg/encrypt.sh" >"${BACKUP_FILE}"
}

function replicate_backups() {
  echo "Replicating MongoDB backups..."
  mkdir -p "${BACKUP_NAS_DIR}"
  rsync -rltzv "${BACKUP_LOCAL_DIR}/" "${BACKUP_NAS_DIR}/"
}

function remove_old_backups() {
  echo "Removing old MongoDB backups..."
  find "${BACKUP_LOCAL_DIR}" -mindepth 1 -maxdepth 1 -prune -ctime +7 -exec rm -r "{}" \;
  find "${BACKUP_NAS_DIR}" -mindepth 1 -maxdepth 1 -prune -ctime +30 -exec rm -r "{}" \;
}

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
backup
replicate_backups
remove_old_backups
