#!/bin/bash

echo $ROOT_DIR

readonly ANSIBLE_DIR="${ROOT_DIR}/.infra/ansible"
readonly INFRA_DIR="${ROOT_DIR}/.infra/vault"
readonly VAULT_FILE="${1:-${INFRA_DIR}/vault.yml}"
readonly VAULT_PASSWORD_FILE="${ROOT_DIR}/.bin/scripts/get-vault-password-client.sh"

echo ""
echo "🔀 Chemin de VAULT_PASSWORD_CLIENT : $VAULT_PASSWORD_FILE"
echo ""

echo "🚀 Lancement de la génération de la seed"
echo ""
# Récupérer les informations d'identification de la base de données à partir du Vault

DB_URL=$(ansible-vault view $VAULT_FILE --vault-password-file="$VAULT_PASSWORD_FILE" | grep PSQL_URI | head -n 1 | awk '{print $2}' | xargs)
SCHEMA_DUMP_FILE="${ROOT_DIR}/server/seed/seed_schema.dump"
DATA_DUMP_FILE="${ROOT_DIR}/server/seed/seed_data.dump"

echo "🔑 DB_URL : $DB_URL"
echo ""

# Générer le fichier de dump
echo "🌱 Génération de la seed contenant le schéma de la DB"
echo ""
pg_dump $DB_URL --format=custom --clean --if-exists --schema-only --file $SCHEMA_DUMP_FILE

echo "🤖 Génération de la seed contenant les données de la DB"
echo ""

pg_dump $DB_URL --format=custom --data-only \
  --exclude-table='public."changeLog"' \
  --exclude-table='public."job"' \
  --exclude-table='public."changementStatut"' \
  --exclude-table='public."demande"' \
  --exclude-table='public."demandeAccessLog"' \
  --exclude-table='public."rawData"' \
  --exclude-table='public."user"' \
  --exclude-table='public."avis"' \
  --exclude-table='public."suivi"' \
  --file $DATA_DUMP_FILE

if [ $? -eq 0 ]; then
  echo "✅ Dump de la base de données généré avec succès"
else
  echo "❌ Échec de la génération du dump de la base de données."
fi

