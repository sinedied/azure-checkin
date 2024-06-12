metadata description = 'Creates a cosmos db role assignment for a service principal.'
param principalId string
param accountName string

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2022-08-15' existing = {
  name: accountName
}

@allowed([
  'Device'
  'ForeignGroup'
  'Group'
  'ServicePrincipal'
  'User'
])
param principalType string = 'ServicePrincipal'
param roleDefinitionId string

resource role 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(subscription().id, resourceGroup().id, principalId, roleDefinitionId)
  scope: cosmosDb
  properties: {
    principalId: principalId
    principalType: principalType
    roleDefinitionId: resourceId('Microsoft.Authorization/roleDefinitions', roleDefinitionId)
  }
}
