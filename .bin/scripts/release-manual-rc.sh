#!/usr/bin/env bash

set -euo pipefail


if [ -z "$1" ]; then
  echo "You need to specify a version"
  exit 1
fi

readonly NEXT_VERSION="$1"

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

verify_version_pattern() {
  local input="$1"

  # Define the regex pattern
  local pattern="^[0-9]+\.[0-9]+\.[0-9]+-rc\.[0-9]+$"
  echo $input 

  # Check if the input matches the pattern
  if [[ "$input" =~ $pattern ]]; then
    return 0
  else
    return 1
  fi
}

if check_git_tag_exists $NEXT_VERSION; then
    echo "Tag 'v$NEXT_VERSION' already exists on remote, aborting..."
    exit 1
fi

if ! verify_version_pattern $NEXT_VERSION; then
    echo "Invalid version pattern. Expected format: 0.0.2-rc.2"
    exit 1
fi

echo "Creating release : $NEXT_VERSION"

echo "Création des images docker locales (docker build)"

echo "Build $NEXT_VERSION ..."
"$ROOT_DIR/.bin/scripts/release-app.sh" $NEXT_VERSION push
git tag -f "v$NEXT_VERSION"
git push -f origin "v$NEXT_VERSION"
