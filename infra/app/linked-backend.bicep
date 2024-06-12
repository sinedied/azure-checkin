param staticWebAppName string
param functionAppName string
param functionAppLocation string

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' existing = {
  name: staticWebAppName
}

resource functionApp 'Microsoft.Web/sites@2022-03-01' existing = {
  name: functionAppName
}

resource linkedStaticWebAppBackend 'Microsoft.Web/staticSites/linkedBackends@2022-03-01' = {
  parent: staticWebApp
  name: 'linkedBackend'
  properties: {
    backendResourceId: functionApp.id
    region: functionAppLocation
  }
}
