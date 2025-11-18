#!/usr/bin/env bash

set -euo pipefail

read -p "[harbor] Harbor user ? : " u
read -p "[harbor] Harbor pass ? : " p

echo "Login sur le registry ..."
echo $p | docker login harbor.forge.education.gouv.fr -u "$u" --password-stdin
echo "Logged!"
