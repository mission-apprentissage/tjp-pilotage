#!/usr/bin/env bash
set -euo pipefail

# echo "Command line interface to view the vault password"
# echo "This file implements Ansible specifications third-party vault tools"
# echo "For more informations see https://docs.ansible.com/ansible/latest/vault_guide/vault_managing_passwords.html#storing-passwords-in-third-party-tools-with-vault-password-client-scripts"

## CHECK UPDATES AND RENEW

readonly VAULT_DIR="${ROOT_DIR}/.infra/vault"

vault_password_file="${VAULT_DIR}/.vault-password-previous.gpg"

if [ ! -f "$vault_password_file" ]; then
    echo "Veuillez télécharger le fichier de mot de passe du coffre fort et le placer dans chemin d'accès suivant : ${selected_password_file}"
    exit 0
fi

decrypt_password() {
  ## Decrypt
  if test -f "${vault_password_file}"; then
    gpg --quiet --batch --use-agent --decrypt "${vault_password_file}"
  else
    #Allows to run playbooks with --vault-password-file even if password has not been yet generated
    echo "not-yet-generated"
  fi

  gpgconf --kill gpg-agent
}

decrypt_password
