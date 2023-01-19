#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec -it pilotage_mongodb mongosh "{{ vault[env_type].PILOTAGE_MONGODB_URI }}" "$@"
