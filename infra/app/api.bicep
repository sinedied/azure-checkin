@description('Specifies the name of the function app.')
param name string

@description('Specifies the location.')
param location string = resourceGroup().location

param appServicePlanId string
param storageAccountName string
param applicationInsightsInstrumentationKey string
param applicationInsightsConnectionString string
@secure()
param CosmosDBConnectionString string
param CosmosDBDatabaseName string
param virtualNetworkSubnetId string = ''
param allowedOrigins array = []
param tags object = {}

module api '../core/host/functions.bicep' = {
  name: 'api'
  scope: resourceGroup()
  params: {
    name: name
    location: location
    tags: tags
    allowedOrigins: allowedOrigins
    runtimeName: 'node'
    runtimeVersion: '20'
    appServicePlanId: appServicePlanId
    storageAccountName: storageAccountName
    managedIdentity: true
    // instanceMemoryMB: 2048
    // maximumInstanceCount: 10
    virtualNetworkSubnetId: virtualNetworkSubnetId
    appSettings: {
      APPINSIGHTS_INSTRUMENTATIONKEY: applicationInsightsInstrumentationKey
      APPLICATIONINSIGHTS_CONNECTION_STRING: applicationInsightsConnectionString
      CosmosDBConnectionString: CosmosDBConnectionString
      CosmosDBDatabaseName: CosmosDBDatabaseName
    }
  }
}

output name string = api.outputs.name
output uri string = api.outputs.uri
output identityPrincipalId string = api.outputs.identityPrincipalId
