#!/bin/bash
set -euo

readonly SSL_OUTPUT_DIR="/ssl"

if [ ! -d "${SSL_OUTPUT_DIR}" ]; then
  echo "You must mount directory on path ${SSL_OUTPUT_DIR}"
  exit 1
fi

function start_http_server_for_acme_challenge() {
  mkdir -p /var/www
  serve -l 5000 /var/www &
}

function generate_certificate() {
  local dns_name="${1}"

  echo "Generating certificate for domain ${dns_name}..."
  certbot certonly \
    --email contact@inserjeunes.beta.gouv.fr \
    --agree-tos \
    --non-interactive \
    --webroot \
    --webroot-path /var/www \
    --domain "${dns_name}"

  cp "/etc/letsencrypt/live/${dns_name}/fullchain.pem" "${SSL_OUTPUT_DIR}"
  cp "/etc/letsencrypt/live/${dns_name}/privkey.pem" "${SSL_OUTPUT_DIR}"
}

function generate_self_signed_certificate() {
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout "${SSL_OUTPUT_DIR}/privkey.pem" \
    -out "${SSL_OUTPUT_DIR}/fullchain.pem" \
    -subj "/C=FR/O=Mission Apprentissage/CN=Root"
}

function renew_certificate() {
  local dns_name="${1}"

  cp -R "${SSL_OUTPUT_DIR}" "/etc/letsencrypt/live/${dns_name}"

  echo "Renewing certificate for domain ${dns_name}..."
  certbot renew

  cp "/etc/letsencrypt/live/${dns_name}/fullchain.pem" "${SSL_OUTPUT_DIR}"
  cp "/etc/letsencrypt/live/${dns_name}/privkey.pem" "${SSL_OUTPUT_DIR}"
}

function main() {

  local task="${1}"
  local dns_name="${2:?"Please provide a dns name"}"

  case "${task}" in
  generate)
    if [ "${dns_name}" == "localhost" ]; then
      generate_self_signed_certificate
    else
      start_http_server_for_acme_challenge
      generate_certificate "${dns_name}"
    fi
    ;;
  renew)
    start_http_server_for_acme_challenge
    renew_certificate "${dns_name}"
    ;;
  *)
    echo "Unknown task '${task}'"
    usage
    exit 1
    ;;
  esac
}

main "$@"
