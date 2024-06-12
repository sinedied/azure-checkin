targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the the environment which is used to generate a short unique hash used in all resources.')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string

param resourceGroupName string = ''
param webappName string = 'webapp'
param apiServiceName string = 'api'
param appServicePlanName string = ''
param storageAccountName string = ''
param logAnalyticsName string = ''
param applicationInsightsName string = ''
param applicationInsightsDashboardName string = ''

// Location is not relevant here as it's only for the built-in api
// which is not used here. Static Web App is a global service otherwise
@description('Location for the Static Web App')
@allowed(['westus2', 'centralus', 'eastus2', 'westeurope', 'eastasia', 'eastasiastage'])
@metadata({
  azd: {
    type: 'location'
  }
})
param webappLocation string // Set in main.parameters.json

param domainName string // Set in main.parameters.json

// Id of the user or app to assign application roles
param principalId string = ''

// Differentiates between automated and manual deployments
param isContinuousDeployment bool // Set in main.parameters.json

var abbrs = loadJsonContent('abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
var tags = {
  'azd-env-name': environmentName
}

// Organize resources in a resource group
resource resourceGroup 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: !empty(resourceGroupName) ? resourceGroupName : '${abbrs.resourcesResourceGroups}${environmentName}'
  location: location
  tags: tags
}

// The application webapp
module webapp './core/host/staticwebapp.bicep' = {
  name: 'webapp'
  scope: resourceGroup
  params: {
    name: !empty(webappName) ? webappName : '${abbrs.webStaticSites}web-${resourceToken}'
    location: webappLocation
    tags: union(tags, { 'azd-service-name': webappName })
  }
}

resource kv 'Microsoft.KeyVault/vaults@2022-07-01' existing = {
  scope: resourceGroup
  name: keyvault.outputs.name
}

module api './app/api.bicep' = {
  name: 'api'
  scope: resourceGroup
  params: {
    name: '${abbrs.webSitesFunctions}api-${resourceToken}'
    location: location
    tags: union(tags, { 'azd-service-name': apiServiceName })
    allowedOrigins: [webapp.outputs.uri]
    appServicePlanId: appServicePlan.outputs.id
    storageAccountName: storage.outputs.name
    applicationInsightsInstrumentationKey: monitoring.outputs.applicationInsightsInstrumentationKey
    applicationInsightsConnectionString: monitoring.outputs.applicationInsightsConnectionString
    CosmosDBConnectionString: kv.getSecret(cosmosDb.outputs.connectionStringKey)
    CosmosDBDatabaseName: cosmosDb.outputs.databaseName
    // virtualNetworkSubnetId: vnet.outputs.appSubnetID
  }
}

// Link the Function App to the Static Web App
module linkedBackend './app/linked-backend.bicep' = {
  name: 'linkedbackend'
  scope: resourceGroup
  params: {
    staticWebAppName: webapp.outputs.name
    functionAppName: api.outputs.name
    functionAppLocation: location
  }
}

// Compute plan for the Azure Functions API
module appServicePlan './core/host/appserviceplan.bicep' = {
  name: 'appserviceplan'
  scope: resourceGroup
  params: {
    name: !empty(appServicePlanName) ? appServicePlanName : '${abbrs.webServerFarms}${resourceToken}'
    location: location
    tags: tags
    // sku: {
    //   name: 'Y1'
    //   tier: 'Dynamic'
    // }
    // sku: {
    //   name: 'FC1'
    //   tier: 'FlexConsumption'
    //   size: 'FC'
    //   family: 'FC'
    // }
    reserved: true
    sku: {
      name: 'EP1'
      // capacity: 1
    }
  }
}

module monitoring './core/monitor/monitoring.bicep' = {
  name: 'monitoring'
  scope: resourceGroup
  params: {
    location: location
    tags: tags
    logAnalyticsName: !empty(logAnalyticsName) ? logAnalyticsName : '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: !empty(applicationInsightsName) ? applicationInsightsName : '${abbrs.insightsComponents}${resourceToken}'
    applicationInsightsDashboardName: !empty(applicationInsightsDashboardName) ? applicationInsightsDashboardName : '${abbrs.portalDashboards}${resourceToken}'
  }
}

module storage './core/storage/storage-account.bicep' = {
  name: 'storage'
  scope: resourceGroup
  params: {
    name: !empty(storageAccountName) ? storageAccountName : '${abbrs.storageStorageAccounts}${resourceToken}'
    location: location
    tags: tags
    allowBlobPublicAccess: false
  }
}

module cosmosDb './core/database/cosmos/sql/cosmos-sql-db.bicep' = {
  name: 'cosmosDb'
  scope: resourceGroup
  params: {
    accountName: '${abbrs.documentDBDatabaseAccounts}${resourceToken}'
    location: location
    tags: tags
    containers: [
      {
        name: 'events'
        id: 'events'
        partitionKey: '/id'
      }
    ]
    databaseName: 'events'
    keyVaultName: keyvault.outputs.name
  }
}

module vnet './app/vnet.bicep' = {
  name: 'vnet'
  scope: resourceGroup
  params: {
    name: '${abbrs.networkVirtualNetworks}${resourceToken}'
    location: location
    tags: tags
  }
}

module keyvault './core/security/keyvault.bicep' = {
  name: 'keyvault'
  scope: resourceGroup
  params: {
    name: '${abbrs.keyVaultVaults}${resourceToken}'
    location: location
    tags: tags
    principalId: isContinuousDeployment ? '' : principalId
  }
}

// module domain './app/domain.bicep' = {
//   name: 'domain'
//   scope: resourceGroup
//   params: {
//     staticWebAppName: webapp.outputs.name
//     domainName: domainName
//     tags: tags
//   }
// }

// Managed identity roles assignation
// ---------------------------------------------------------------------------

// User roles
module storageContribRoleUser 'core/security/role.bicep' = if (!isContinuousDeployment) {
  scope: resourceGroup
  name: 'storage-contrib-role-user'
  params: {
    principalId: principalId
    // Storage Blob Data Owner
    roleDefinitionId: 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
    principalType: 'User'
  }
}

module dbContribRoleUser 'app/cosmos-db-role.bicep' = if (!isContinuousDeployment) {
  scope: resourceGroup
  name: 'db-contrib-role-user'
  params: {
    accountName: cosmosDb.outputs.accountName
    principalId: principalId
    // Cosmos DB Built-in Data Contributor
    roleDefinitionId: '00000000-0000-0000-0000-000000000002'
    principalType: 'ServicePrincipal'
  }
}

// System roles
module storageContribRoleApi 'core/security/role.bicep' = {
  scope: resourceGroup
  name: 'storage-contrib-role-api'
  params: {
    principalId: api.outputs.identityPrincipalId
    // Storage Blob Data Owner
    roleDefinitionId: 'b7e6dc6d-f1e8-4753-8033-0f276bb0955b'
    principalType: 'ServicePrincipal'
  }
}

module dbContribRoleApi 'app/cosmos-db-role.bicep' = {
  scope: resourceGroup
  name: 'db-contrib-role-api'
  params: {
    accountName: cosmosDb.outputs.accountName
    principalId: api.outputs.identityPrincipalId
    // Cosmos DB Built-in Data Contributor
    roleDefinitionId: '00000000-0000-0000-0000-000000000002'
    principalType: 'ServicePrincipal'
  }
}

output AZURE_LOCATION string = location
output AZURE_TENANT_ID string = tenant().tenantId
output AZURE_RESOURCE_GROUP string = resourceGroup.name

output API_URL string = api.outputs.uri
output WEBAPP_URL string = webapp.outputs.uri
