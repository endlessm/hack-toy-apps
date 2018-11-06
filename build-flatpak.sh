#!/bin/bash
set -e
set -x
rm -rf var metadata export build

if [ $# -lt 1 ]; then
  echo "No app ID provided" >&2
  exit 1
fi

APP_ID=$1
REPO=${REPO:-repo}

./generate_manifest $APP_ID
flatpak-builder build --ccache $APP_ID.json --repo=${REPO}
flatpak build-bundle ${REPO} $APP_ID.flatpak $APP_ID
