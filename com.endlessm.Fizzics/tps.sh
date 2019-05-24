#!/usr/bin/env bash
if ! [ -x "$(command -v TexturePacker)" ]; then
    exit 0
fi
TexturePacker --version
for i in  $(find ./raw_assets/ -type f -name '*.tps'); do # Whitespace-safe and recursive
    TexturePacker "$i"
done
