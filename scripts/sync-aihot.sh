#!/usr/bin/env sh
set -eu

: "${AIHOT_SYNC_URL:?AIHOT_SYNC_URL is required}"
: "${AIHOT_SYNC_SECRET:?AIHOT_SYNC_SECRET is required}"

curl -fsS -X POST \
  -H "x-sync-secret: ${AIHOT_SYNC_SECRET}" \
  "${AIHOT_SYNC_URL}"
