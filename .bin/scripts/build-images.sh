#!/bin/bash
set -euo pipefail

export VERSION="${1:?"Veuillez préciser la version"}"
mode=${2:?"Veuillez préciser le mode <push|load>"}
shift 2

get_channel() {
  local version="$1"
  channel=$(echo "$version" | cut -d '-' -f 2)

  if [ "$channel" == "$version" ]; then
    channel="latest"
  else
    channel=$(echo $channel | cut -d '.' -f 1 )
  fi

  echo $channel
}

if [[ $# == "0" ]]; then
  echo "Veuillez spécifier les environnements à build (production, recette, preview, local)"
  exit 1;
fi;

# Vérifier la connexion au Docker distant
echo "Test de connexion Docker..."
if ! docker info > /dev/null 2>&1; then
  echo "ERREUR: Impossible de se connecter au daemon Docker"
  exit 1
fi
echo "✓ Connexion Docker OK"

# Vérifier que le login Harbor est effectif
echo "Vérification authentification Harbor..."
if ! docker login harbor.forge.education.gouv.fr --username "$HARBOR_USER" --password-stdin <<< "$HARBOR_PASS" 2>/dev/null; then
  echo "ERREUR: Authentification Harbor échouée"
  exit 1
fi
echo "✓ Authentification Harbor OK"

# Utiliser le builder par défaut (docker driver ne supporte pas de builders multiples)
echo "Utilisation du builder par défaut..."
docker buildx use default
echo "✓ Builder par défaut sélectionné"

if [[ ! -z "${CI:-}" ]]; then
  export DEPS_ID=($(md5sum $ROOT_DIR/yarn.lock))
else
  export DEPS_ID=""
fi

export CHANNEL=$(get_channel $VERSION)

# S'assurer que les variables proxy sont exportées pour docker buildx bake
export HTTP_PROXY="${HTTP_PROXY:-}"
export HTTPS_PROXY="${HTTPS_PROXY:-}"
export NO_PROXY="${NO_PROXY:-}"

echo "Configuration proxy:"
echo "  HTTP_PROXY=$HTTP_PROXY"
echo "  HTTPS_PROXY=$HTTPS_PROXY"
echo "  NO_PROXY=$NO_PROXY"

# Build avec docker buildx bake
echo "Démarrage du build..."
docker buildx bake \
  --provenance=false \
  --sbom=false \
  --${mode} \
  "$@"

# Nettoyage du cache Docker
echo "Nettoyage du cache..."
docker builder prune --keep-storage 20GB --force

echo "✓ Build terminé avec succès"
