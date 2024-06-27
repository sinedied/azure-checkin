#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")"

if azd_env=$(azd env get-values); then
  echo "Loading azd .env file from current environment"
  export $(echo "$azd_env" | xargs)
fi

# Deploy api
cd api
func azure functionapp publish "${API_NAME}" --subscription "${AZURE_SUBSCRIPTION_ID}"

# Deploy webapp
azd deploy webapp
