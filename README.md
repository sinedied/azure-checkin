# Azure Check-in

> A streamlined onboarding experience with Azure Pass for your events.

<p align="center">
  <img src="https://github.com/sinedied/azure-checkin/blob/main/src/assets/twitter-banner.jpg?raw=true" alt="azure boarding pass"/>
<p>

You can access the deployed production website at https://azcheck.in.

## Stack

This app is build on a full serverless model, using [Angular](https://angular.io/) for the frontend, [Azure Functions](https://azure.microsoft.com/services/functions/?WT.mc_id=javascript-6489-yolasors) for the backend, [Azure Cosmos DB](https://azure.microsoft.com/services/cosmos-db/?WT.mc_id=javascript-6489-yolasors) for the database and [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/?WT.mc_id=javascript-6489-yolasors) for the hosting.

You can learn more about serverless apps and static web apps with these resources:

- [Create serverless apps](https://docs.microsoft.com/learn/paths/create-serverless-applications/?WT.mc_id=javascript-6489-yolasors) (tutorials)
- [Beginner's Series to Serverless](https://aka.ms/serverless-series) (videos)
- [Learn Azure Static Web Apps](https://docs.microsoft.com/learn/paths/azure-static-web-apps/?WT.mc_id=javascript-6489-yolasors) (tutorials)
- [Azure Static Web Apps Tips & Tricks](https://aka.ms/StaticWebAppsTips) (videos)

## Development

You need to have at least a deployed [Cosmos DB instance](https://azure.microsoft.com/services/cosmos-db/?WT.mc_id=javascript-6489-yolasors) to work on this app. You can create a free trial Cosmos DB instance for testing [using this link](https://azure.microsoft.com/try/cosmosdb/?WT.mc_id=javascript-6489-yolasors).

1. Clone this repository on your local machine.
1. Run `npm install` to install all dependencies.
1. Create the file called `api/local.settings.json` with the following content:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "CosmosDBConnectionString": "<YOUR_COSMOSDB_CONNECTION_STRING>"
  }
}
```

1. Run `npm start`. It will start a local development server for the frontend, the Azure functions emulator for the backend and use the [SWA CLI](https://github.com/Azure/static-web-apps-cli) to expose everything on `http://localhost:4280`.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Deployment

To deploy this app on Azure, you need to have an [Azure subscription](https://azure.microsoft.com/free/?WT.mc_id=javascript-6489-yolasors), and the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?WT.mc_id=javascript-6489-yolasors).

The script `scripts/deployment/create-infra.sh` will create all Azure resources needed to deploy this app, using [Bicep](https://docs.microsoft.com/azure/azure-resource-manager/bicep/overview?WT.mc_id=javascript-6489-yolasors) templates.

(WIP)

## Organizer access

All Cloud Advocates listed on https://github.com/MicrosoftDocs/cloud-developer-advocates are automatically added to the Organizer list using [this script](scripts/admin-extract/extract.js).

If you're not on this list but would like to have organizer access, add your GitHub username **at the top** of [this list](api/administrators.json) by clicking [here](https://github.com/sinedied/azure-checkin/edit/main/api/administrators.json) and submit a Pull Request.
