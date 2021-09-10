#!/bin/bash

if [ -z "$GITHUB_TOKEN" ]; then
  echo "You need to provide a GITHUB_TOKEN environment variable for deployment."
  exit 1
fi

# Use Azure CLI to deploy the infrastructure from the Bicep template.
# Install Azure CLI: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
az deployment group create --template-file main.bicep \
                           --parameters prod=false githubToken=${GITHUB_TOKEN} \
                           --query properties.outputs
