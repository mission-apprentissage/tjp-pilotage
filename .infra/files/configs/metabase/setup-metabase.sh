#!/usr/bin/env bash
set -euo pipefail

PROPS=$(curl -sS --retry 5 --retry-all-errors https://{{dns_name}}/metabase/api/session/properties)
IS_SETUP=$(echo $PROPS | jq -r '."has-user-setup"')

if [[ $IS_SETUP == "true" ]]; then
  echo 'metabase already setup'
  exit 0;
fi

TOKEN=$(echo $PROPS | jq -r '."setup-token"')

curl -sS --retry 5 --retry-all-errors https://{{dns_name}}/metabase/api/setup \
--header 'Content-Type: application/json' \
--data-raw "{
    \"token\": \"$TOKEN\",
    \"user\": {
        \"password_confirm\": \"{{ vault[env_type].METABASE_ADMIN_PASS }}\",
        \"password\": \"{{ vault[env_type].METABASE_ADMIN_PASS }}\",
        \"site_name\": \"{{product_name}}\",
        \"email\": \"{{ vault[env_type].METABASE_ADMIN_EMAIL }}\",
        \"last_name\": null,
        \"first_name\": null
    },
    \"database\": {
        \"is_on_demand\": false,
        \"is_full_sync\": false,
        \"is_sample\": false,
        \"cache_ttl\": null,
        \"refingerprint\": false,
        \"auto_run_queries\": true,
        \"details\": {
            \"ssl-use-client-auth\": false,
            \"ssl\": true,
            \"advanced-options\": false,
            \"schema-filters-type\": \"all\",
            \"ssl-mode\": \"allow\",
            \"host\": \"{{ vault[env_type].PSQL_METABASE_HOST }}\",
            \"port\": {{ vault[env_type].PSQL_METABASE_PORT }},
            \"dbname\": \"{{ vault[env_type].PSQL_METABASE_DB }}\",
            \"user\": \"{{ vault[env_type].PSQL_METABASE_USER }}\",
            \"password\": \"{{ vault[env_type].PSQL_METABASE_PASSWORD }}\",
            \"tunnel-enabled\": false
        },
        \"name\": \"PSQL\",
        \"engine\": \"postgres\"
    },
    \"invite\": null,
    \"prefs\": {
        \"site_name\": \"{{product_name}}\",
        \"site_locale\": \"fr\",
        \"allow_tracking\": false
    }
}"

echo 'metabase setup successfully'
