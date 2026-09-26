#!/usr/bin/env bash
set -u

APK="${1:-$HOME/Downloads/153.apk}"

if [[ ! -f "$APK" ]]; then
  echo "APK not found: $APK" >&2
  echo "Usage: $0 [path/to/file.apk]" >&2
  exit 1
fi

while IFS= read -r device; do
  [[ -z "$device" ]] && continue
  echo "=== $device: installing $APK ==="
  adb -s "$device" install "$APK"
done < <(adb devices | awk 'NR > 1 && $2 == "device" {print $1}')
