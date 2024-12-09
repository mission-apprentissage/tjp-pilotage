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

generate_next_patch_version() {
  local last_current_branch_tag=$(git describe --tags --abbrev=0 --match="v[0-9]*.[0-9]*.[0-9]*")
  local remote_tags=$(git ls-remote --tags origin | awk '{print $2}' | sed 's|refs/tags/||')
  local current_commit_id=$(git rev-parse HEAD)
  local current_version_commit_id=$(git rev-list -n 1 $VERSION 2> /dev/null)

  if [ "$current_commit_id" == "$current_version_commit_id" ]; then
    echo $VERSION;
    return
  fi;

  local version=${last_current_branch_tag#v}

  if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+).*$ ]]; then
    major="${BASH_REMATCH[1]}"
    minor="${BASH_REMATCH[2]}"
    patch="${BASH_REMATCH[3]}"
  else
    echo "Invalid version format $version"
    exit 1
  fi

  rc_number=1

  case $RC_TYPE in
    major)
      ((major++))
      minor=0
      patch=0
      ;;
    minor)
      ((minor++))
      patch=0
      ;;
    patch)
      ((patch++))
      ;;
    *)
      echo "Error: Invalid bump type. Use 'patch', 'minor', or 'major'."
      exit 1
      ;;
  esac

  rc_version="$major.$minor.$patch-rc.$rc_number"
  while echo "$remote_tags" | grep -q "$rc_version"; do
    # Increment rc_number
    ((rc_number++))

    # Remove the first occurrence of the substring to prevent infinite loop
    rc_version="$major.$minor.$patch-rc.$rc_number"
  done
  echo $rc_version
}

echo $(generate_next_patch_version "$@")
