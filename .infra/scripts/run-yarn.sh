#!/usr/bin/env bash
set -xeuo pipefail

readonly ENV_NAME="${1:?"Please provide an environment name (eg. recette)"}"; shift;
readonly ANSIBLE_DIR="$(cd "$(dirname "../${BASH_SOURCE[0]}")" && pwd)/ansible";

function main() {
    echo "Running command ${@} on environment ${ENV_NAME}..."
    local env_ip
    env_ip="$(cat "${ANSIBLE_DIR}/env.ini" | grep "\[${ENV_NAME}\]" -A 1 | tail -1)"
    local task
    task="yarn ${@}"
    
    ssh -i ./mnadevops ansible@${env_ip} "bash -c 'sudo docker exec pilotage_server ${task}'"
}

main "$@"
