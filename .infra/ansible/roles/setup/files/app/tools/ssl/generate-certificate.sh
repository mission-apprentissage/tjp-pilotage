#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "/opt/pilotage/data/ssl/privkey.pem" ]; then
  # Arrêter les conteneurs utilisant le port 80
  running_container=$(docker ps --filter "publish=80" -q)
  if [ -n "$running_container" ]; then
    docker stop "$running_container"
  fi

  cd "${SCRIPT_DIR}"
    docker build --tag pilotage_certbot certbot/
    docker run --rm --name pilotage_certbot \
      -p 80:5000 \
      -v /opt/pilotage/data/certbot:/etc/letsencrypt \
      -v /opt/pilotage/data/ssl:/ssl \
      pilotage_certbot generate "$@"
  cd -

  # Redémarrer le conteneur si nécessaire
  if [ -n "$running_container" ]; then
    docker start "$running_container"
  fi
else
  echo "Certificat SSL déja généré"
fi
