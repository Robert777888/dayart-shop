#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:4321}"

run_case() {
  local template_id="$1"
  local payload_json="$2"

  echo "Running: ${template_id}"
  local response
  response=$(curl -sS -X POST "${BASE_URL}/api/templates/compose" \
    -H "Content-Type: application/json" \
    -d "{\"templateId\":\"${template_id}\",\"payload\":${payload_json}}")

  echo "$response" | rg '"success":true' >/dev/null
  echo "$response" | rg '"designUrl":"' >/dev/null
}

run_case "vintage_year_badge" '{"year":"1999","name":"Limited Edition","city":"Budapest","slogan":"Crafted For Legends"}'
run_case "pet_name_emblem" '{"petType":"dog","name":"Milo","year":"2021"}'
run_case "family_birth_garden" '{"title":"A mi csaladi kertunk","members":[{"name":"Anna","month":"jan"},{"name":"Mate","month":"feb"}]}'

echo "Template API smoke test passed at ${BASE_URL}"
