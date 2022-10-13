#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

bash /opt/pilotage/tools/backup-mongodb.sh
bash /opt/pilotage/cli.sh migrate
