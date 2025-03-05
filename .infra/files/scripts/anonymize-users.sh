#!/usr/bin/env bash
set -euo pipefail

cd /opt/app
/opt/app/tools/docker-compose.sh run --rm --no-deps server yarn cli anonymizeUsers
