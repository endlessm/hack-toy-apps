#!/bin/bash -e

rm -rf var metadata export build

ARGS=$(getopt -o h \
  -l "flatpak-branch:,git-branch:,help" \
  -n "build-flatpak.sh" -- "$@")
eval set -- "$ARGS"

usage() {
    cat <<EOF
Usage: $0 [OPTION]... APP_ID
Generate flatpak bundle for the given app

  --flatpak-branch          flatpak branch to export it to
  --git-branch              git branch to use in manifest
  -h, --help                display this help and exit

EOF
}

REPO=${REPO:-repo}
GIT_CLONE_BRANCH=${GIT_CLONE_BRANCH:-HEAD}

FLATPAK_BRANCH=master
case ${GIT_CLONE_BRANCH} in
  stable)
    FLATPAK_BRANCH=stable
    ;;
  master)
    FLATPAK_BRANCH=master
    ;;
  *)
    FLATPAK_BRANCH=custom
    ;;
esac

while true; do
  case "$1" in
  --flatpak-branch)
    FLATPAK_BRANCH=$2
    shift 2
    ;;
  --git-branch)
    GIT_BRANCH=$2
    shift 2
    ;;
  -h|--help)
    usage
    exit 0
    ;;
  --)
    shift
    break
    ;;
  esac
done

APP_ID=$1

./generate_manifest --flatpak-branch=${FLATPAK_BRANCH} --git-branch=${GIT_CLONE_BRANCH} $APP_ID
flatpak-builder build --ccache $APP_ID.json --repo=${REPO}
flatpak build-bundle ${REPO} $APP_ID.flatpak $APP_ID ${FLATPAK_BRANCH}
