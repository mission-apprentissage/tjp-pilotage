#!/usr/bin/env bash
set -euo pipefail

readonly TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

function destroy_vm() {
  vagrant halt
  vagrant destroy --force
}

function create_vm() {
  ansible-galaxy install geerlingguy.docker
  ansible-galaxy collection install community.general
  ansible-galaxy collection install community.crypto
  ansible-galaxy collection install ansible.posix
  vagrant plugin install vagrant-scp

  VAGRANT_EXPERIMENTAL="disks" vagrant up --no-provision
}

function run_playbook() {
  ANSIBLE_TAGS=${ANSIBLE_TAGS:-""} \
  ANSIBLE_PLAYBOOK=${ANSIBLE_PLAYBOOK:-"setup"} \
  GIT_REVISION=${GIT_REVISION:-"main"} \
  vagrant provision
  echo "You can check instance with command 'vagrant ssh'. Application is available at https://192.168.56.7/"
}

cd "${TEST_DIR}"

if [ "${1:-''}" == "--clean" ]; then
  destroy_vm
fi

if [ "$(vagrant status default | grep 'running')" ]; then
  echo "VM already started"
else
  create_vm
fi

run_playbook

cd - >/dev/null
