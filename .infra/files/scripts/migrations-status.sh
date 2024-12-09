#!/usr/bin/env bash
set -euo pipefail

/opt/app/tools/docker-compose.sh run --rm --no-deps server yarn cli migrations:status
