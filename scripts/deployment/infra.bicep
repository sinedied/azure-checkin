param prod bool = true
param appName string = 'azcheckin'
param githubRepo string = 'sinedied/azure-checkin'
param githubToken string
param domainName string = 'azcheck.in'
param location string = resourceGroup().location

var suffix = prod ? '' : uniqueString(resourceGroup().id)
var dashSuffix = prod ? '' : '-${suffix}'
var commonTags = {
  usage: appName
  production: prod ? 'true' : 'false'
}
var domains = [
  domainName
  'www.${domainName}'
]

var storageAccountConnectionString = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${listKeys(storageAccount.id, storageAccount.apiVersion).keys[0].value}'
var appInsightIntrumentationKey = reference(appInsights.id, appInsights.apiVersion).InstrumentationKey
var cosmosDbConnectionString = listConnectionStrings(cosmosDb.id, cosmosDb.apiVersion).connectionStrings[0].connectionString

resource storageAccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: '${appName}${suffix}'
  location: location
  kind: 'StorageV2'
  tags: commonTags
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    allowBlobPublicAccess: false
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2020-12-01' = {
  name: '${appName}-plan${dashSuffix}'
  location: location
  kind: 'functionapp'
  tags: commonTags
  properties: {
    reserved: true
  }
  sku: {
    name: 'Y1'
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${appName}-insights${dashSuffix}'
  location: location
  kind: 'web'
  tags: commonTags
  properties: {
    Application_Type: 'web'
  }
}

resource functionApp 'Microsoft.Web/sites@2020-12-01' = {
  name: '${appName}-func${dashSuffix}'
  location: location
  kind: 'functionapp,linux'
  tags: commonTags
  properties: {
    serverFarmId: appServicePlan.id
    clientAffinityEnabled: false
    siteConfig: {
      appSettings: [
        {
          name: 'FUNCTIONS_WORKER_RUNTIME'
          value: 'node'
        }
        {
          name: 'FUNCTIONS_EXTENSION_VERSION'
          value: '~3'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'AzureWebJobsStorage'
          value: storageAccountConnectionString
        }
        {
          name: 'APPINSIGHTS_INSTRUMENTATIONKEY'
          value: appInsightIntrumentationKey
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: reference(appInsights.id, appInsights.apiVersion).ConnectionString
        }
        {
          name: 'CosmosDBConnectionString'
          value: cosmosDbConnectionString
        }
        {
          name: 'CosmosDBDatabaseName'
          value: cosmosDbDatabase.name
        }
      ]
      use32BitWorkerProcess: false
      netFrameworkVersion: 'v4.6'
      linuxFxVersion: 'Node|14'
    }
  }
  dependsOn: [
    storageAccount
    appInsights
    cosmosDb
  ]
}

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2021-06-15' = {
  name: '${appName}-db${dashSuffix}'
  location: location
  tags: commonTags
  kind: 'GlobalDocumentDB'
  properties: {
    publicNetworkAccess: 'Enabled'
    enableAutomaticFailover: false
    // enableMultipleWriteLocations: false
    // disableKeyBasedMetadataWriteAccess: false
    databaseAccountOfferType: 'Standard'
    // defaultIdentity: 'FirstPartyIdentity'
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
      maxIntervalInSeconds: 5
      maxStalenessPrefix: 100
    }
    locations: [
      {
        locationName: location
        // failoverPriority: 0
        // isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableServerless'
      }
    ]
    backupPolicy: {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
      }
    }
  }
}

resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2021-06-15' = {
  parent: cosmosDb
  name: '${appName}db'
  properties: {
    resource: {
      id: '${appName}db'
    }
  }

  resource cosmosDbContainer 'containers@2021-04-15' = {
    name: 'events'
    properties: {
      resource: {
        id: 'events'
        partitionKey: {
          paths: [
            '/id'
          ]
          kind: 'Hash'
        }
      }
    }
  }
}

resource staticWebApp 'Microsoft.Web/staticSites@2021-01-15' = {
  name: '${appName}-staticwebapp${dashSuffix}'
  location: location
  tags: commonTags
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
  properties: {
    repositoryUrl: 'https://github.com/${githubRepo}'
    branch: 'main'
    provider: 'GitHub'
    repositoryToken: githubToken
    buildProperties: {
      appLocation: '/'
      apiLocation: ''
      outputLocation: 'dist/azure-checkin'
      skipGithubActionWorkflowGeneration: true
      githubActionSecretNameOverride: 'AZURE_SWA_TOKEN'
    }
    stagingEnvironmentPolicy: 'Enabled'
    allowConfigFileUpdates: true
    userProvidedFunctionApps: [
      {
          functionAppResourceId: functionApp.id
          functionAppRegion: location
      }
    ]
  }
  dependsOn: [
    functionApp
  ]

  // resource staticWebAppSettings 'config@2021-01-15' = {
  //   name: 'appsettings'
  //   properties: {
  //     APPINSIGHTS_INSTRUMENTATIONKEY: appInsightIntrumentationKey
  //   }
  // }

  // resource staticWebAppDomains 'customDomains@2021-01-15' = [for domain in domains: {
  //   name: domain
  //   properties: {
  //     validationMethod: 'dns-txt-token'
  //   }    
  // }]
}

resource dnsZones 'Microsoft.Network/dnszones@2018-05-01' = if (prod == false) {
  name: domainName
  location: 'global'
  tags: commonTags
  properties: {
    zoneType: 'Public'
  }

  resource dnsZonesWww 'CNAME@2018-05-01' = {
    name: 'www'
    properties: {
      TTL: 3600
      CNAMERecord: {
        cname: staticWebApp.properties.defaultHostname
      }
    }
    dependsOn: [
      staticWebApp
    ]
  }
  
  resource dnsZonesTxt 'TXT@2018-05-01' = {
    name: '@'
    properties: {
      TTL: 3600
      TXTRecords: [
        {
          value: [
            // staticWebApp.properties.customDomainVerificationId
            '123'
          ]
        }
      ]
    }
  }
  
  resource dnsZonesA 'A@2018-05-01' = {
    name: '@'
    properties: {
      TTL: 3600
      targetResource: {
        id: staticWebApp.id
      }
    }
    dependsOn: [
      staticWebApp
    ]
  }
}

// output dns object = staticWebAppDomain
output staticWebAppDefaultHostname string = staticWebApp.properties.defaultHostname
output cosmosDbConnectionString string = cosmosDbConnectionString
output storageAccountConnectionString string = storageAccountConnectionString
output functionAppPublishProfile object = list('${functionApp.id}/config/publishingcredentials', functionApp.apiVersion)
