#!/usr/bin/env bash
set -u

PACKAGE="com.google.android.webview"

while IFS= read -r device; do
  [[ -z "$device" ]] && continue
  echo "=== $device: uninstalling update for $PACKAGE ==="
  adb -s "$device" shell pm uninstall "$PACKAGE"
done < <(adb devices | awk 'NR > 1 && $2 == "device" {print $1}')
