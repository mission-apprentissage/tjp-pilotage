#!/usr/bin/env bash

set -euo pipefail


# Check if an argument is provided
if [[ $# -lt 1 ]]; then
    echo "Error: No arguments provided."
    echo "Usage: Provide 'patch', 'minor', or 'major' as the first argument."
    exit 1
fi

readonly RC_TYPE=$1

case $RC_TYPE in
  patch|minor|major)
    ;;
  *)
    echo "Invalid argument: $RC_TYPE"
    echo "Usage: Provide 'patch', 'minor', or 'major' as the first argument."
    exit 1
    ;;
esac

readonly VERSION=$("${ROOT_DIR}/.bin/scripts/get-version.sh")
NEXT_VERSION=$("$ROOT_DIR/.bin/scripts/generate-rc-label.sh" "$@")

echo "Creating release : $NEXT_VERSION"

echo "Création des images docker locales (docker build)"

echo "Build $NEXT_VERSION ..."
"$ROOT_DIR/.bin/scripts/release-app.sh" $NEXT_VERSION push
git tag -f "v$NEXT_VERSION"
git push -f origin "v$NEXT_VERSION"
