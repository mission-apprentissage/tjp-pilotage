#!/usr/bin/env bash
set -euo pipefail
#Needs to be run as sudo

docker exec pilotage_server yarn --silent jobs
