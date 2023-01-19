#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly DNS_NAME=${1:?"Merci de préciser le nom de domaine"}; shift;

start_reverse_proxy() {
  bash /opt/pilotage/start-app.sh "$(git --git-dir=/opt/pilotage/repository/.git rev-parse --abbrev-ref HEAD)" \
    --no-deps reverse_proxy
}

stop_reverse_proxy() {
  bash /opt/pilotage/stop-app.sh pilotage_reverse_proxy --no-deps reverse_proxy
}

renew_certificate() {
  cd "${SCRIPT_DIR}"
  docker build --tag pilotage_certbot certbot/
  docker run --rm --name pilotage_certbot \
    -p 80:5000 \
    -v /opt/pilotage/data/certbot:/etc/letsencrypt \
    -v /opt/pilotage/data/ssl:/ssl \
    pilotage_certbot renew "${DNS_NAME}"
  cd -
}

handle_error() {
  bash /opt/pilotage/tools/send-to-slack.sh "[SSL] Unable to renew certificate"
  start_reverse_proxy
}
trap handle_error ERR

echo "****************************"
echo "[$(date +'%Y-%m-%d_%H%M%S')] Running ${BASH_SOURCE[0]} $*"
echo "****************************"
stop_reverse_proxy
renew_certificate
start_reverse_proxy
bash /opt/pilotage/tools/send-to-slack.sh "[SSL] Certificat has been renewed"
