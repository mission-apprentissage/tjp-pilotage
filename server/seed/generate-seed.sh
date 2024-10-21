#!/bin/bash

readonly VAULT_PASSWORD_CLIENT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/vault/get-vault-password-client.sh"

echo "Chemin de VAULT_PASSWORD_CLIENT : $VAULT_PASSWORD_CLIENT"

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ANSIBLE_DIR="${SCRIPT_DIR}/../../.infra/ansible"
readonly VAULT_FILE="${1:-${ANSIBLE_DIR}/roles/setup/vars/main/vault.yml}"
readonly VAULT_PASSWORD_FILE="${SCRIPT_DIR}/../../.infra/scripts/vault/get-vault-password-client.sh"

echo "Lancement de la génération de la seed"

# Récupérer les informations d'identification de la base de données à partir du Vault

DB_URL=$(ansible-vault view $VAULT_FILE --vault-password-file "${VAULT_PASSWORD_FILE}" | grep PILOTAGE_POSTGRES_URI | head -n 1 | awk '{print $2}' | xargs)
SCHEMA_DUMP_FILE="seed_schema.dump"
DATA_DUMP_FILE="seed_data.dump"

echo "DB_URL : $DB_URL"
echo ""

# Générer le fichier de dump
echo "Génération de la seed contenant le schéma de la DB"
echo ""
pg_dump $DB_URL -Fc --clean --if-exists --create --schema-only --file $SCHEMA_DUMP_FILE

echo "Génération de la seed contenant les données de la DB"
pg_dump $DB_URL -Fc --data-only \
  --exclude-table='public."changeLog"' \
  --exclude-table='public."changementStatut"' \
  --exclude-table='public."demande"' \
  --exclude-table='public."intention"' \
  --exclude-table='public."intentionAccessLog"' \
  --exclude-table='public."rawData"' \
  --exclude-table='public."user"' \
  --exclude-table='public."avis"' \
  --exclude-table='public."suivi"' \
  --file $DATA_DUMP_FILE

if [ $? -eq 0 ]; then
  echo "Dump de la base de données généré avec succès"
else
  echo "Échec de la génération du dump de la base de données."
fi
