#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly ANSIBLE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../ansible"
readonly ENV_FILTER=${1:?"Merci de préciser un ou plusieurs environnements (ex. recette ou production)"}
shift

function setup() {
  echo "Installation de(s) environnement(s) ${ENV_FILTER}..."

  cd "${ANSIBLE_DIR}"
  ansible-galaxy collection install --requirements-file galaxy-requirements.yml
  ansible-playbook \
    -i env.ini \
    --limit "${ENV_FILTER}" \
    --vault-password-file="${SCRIPT_DIR}/vault/get-vault-password-client.sh" \
     setup.yml "$@" --ask-become-pass
  cd -
}

setup "$@"
