#!/usr/bin/env bash

set -euo pipefail

echo "Push les images docker sur le registry github (https://ghcr.io/mission-apprentissage/)"

readonly VERSION=$("${ROOT_DIR}/.bin/scripts/get-version.sh")

get_channel() {
  local version="$1"
  channel=$(echo "$version" | cut -d '-' -f 2)

  if [ "$channel" == "$version" ]; then
    channel="latest"
    echo $channel
  else
    channel=$(echo $channel | cut -d '.' -f 1 )
  fi

  echo $channel
}

generate_next_patch_version() {
  local current_commit_id=$(git rev-parse HEAD)
  local current_version_commit_id=$(git rev-list -n 1 $VERSION 2> /dev/null)

  if [ "$current_commit_id" == "$current_version_commit_id" ]; then
    echo $VERSION;
    return
  fi;

  local version="$VERSION"
  
  # Extract major version
  local major="${version%%.*}"
  version="${version#*.}"

  # Extract minor version
  local minor="${version%%.*}"
  version="${version#*.}"

  # Extract patch version
  local patch="${version%%-*}"

  # Check for pre-release and build metadata
  if [[ "$version" =~ "-" ]]; then
    version="${version#*-}"
    local pre_release_channel="${version%%.*}"
    local pre_release_number="${version#*.}"

    # echo "$major.$minor.$patch$((patch + 1))"
    echo "$major.$minor.$patch-$pre_release_channel.$((pre_release_number + 1))"
  else
    echo "$major.$minor.$patch-rc.1" # Nouvelle version de correctif
  fi
}

check_git_tag_exists() {
    local tag="v$1"
    local remote="${2:-origin}" # Default remote is 'origin'

    # Check if tag exists remotely
    if git ls-remote --tags "$remote" | grep -q "refs/tags/$tag"; then
        return 0
    else
        return 1
    fi
}

select_version() {
  local NEXT_PATCH_VERSION=$(generate_next_patch_version)

  if [ $NEXT_PATCH_VERSION == $VERSION ]; then
    read -p "Current commit is already deployed as $VERSION. Do you want to overwrite ? [Y/n]: " overwrite
    case $overwrite in
      [yY][eE][sS]|[yY]|"")
        echo "$VERSION"
        return;
        ;;
      *)
        ;;
    esac
  fi;

  read -p "Current version $VERSION > New version ($NEXT_PATCH_VERSION) ? [Y/n]: " response
  case $response in
    [nN][oO]|[nN])
      read -p "Custom version : " CUSTOM_VERSION
      echo "$CUSTOM_VERSION"
      ;;
    [yY][eE][sS]|[yY]|"")
      echo "$NEXT_PATCH_VERSION"
      ;;
    *)
      echo "$response"
      ;;
  esac
}

NEXT_VERSION=$(select_version)

if check_git_tag_exists $NEXT_VERSION; then
    echo "Tag 'v$NEXT_VERSION' already exists on remote, aborting..."
    exit 1;
fi

echo -e '\n'
read -p "Do you need to login to ghcr.io registry? [y/N]" RES_LOGIN

case $RES_LOGIN in
  [yY][eE][sS]|[yY])
    read -p "[ghcr.io] user ? : " u
    read -p "[ghcr.io] GH personnal token ? : " p

    echo "Login sur le registry ..."
    echo $p | docker login ghcr.io -u "$u" --password-stdin
    echo "Logged!"
    ;;
esac

echo "Création des images docker locales (docker build)"

echo "Build ui:$NEXT_VERSION ..."
"$ROOT_DIR/.bin/scripts/release-app.sh" $NEXT_VERSION push
git tag -f "v$NEXT_VERSION"
git push -f origin "v$NEXT_VERSION"
