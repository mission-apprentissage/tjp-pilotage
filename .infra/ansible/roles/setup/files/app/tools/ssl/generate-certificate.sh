#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "/opt/pilotage/data/ssl/privkey.pem" ]; then
  cd "${SCRIPT_DIR}"
    docker build --tag pilotage_certbot certbot/
    docker run --rm --name pilotage_certbot \
      -p 80:5000 \
      -v /opt/pilotage/data/certbot:/etc/letsencrypt \
      -v /opt/pilotage/data/ssl:/ssl \
      pilotage_certbot generate "$@"
  cd -
else
  echo "Certificat SSL déja généré"
fi
