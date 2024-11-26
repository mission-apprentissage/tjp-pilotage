#!/usr/bin/env bash

set -euo pipefail

read -p "[ghcr.io] user ? : " u
read -p "[ghcr.io] GH personnal token ? : " p

echo "Login sur le registry ..."
echo $p | docker login ghcr.io -u "$u" --password-stdin
echo "Logged!"
