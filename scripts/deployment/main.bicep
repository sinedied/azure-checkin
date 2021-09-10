param prod bool = true
param appName string = 'azcheckin'
param githubRepo string = 'sinedied/azure-checkin'
param githubToken string
param domainName string = 'azcheck.in'
param location string = 'West Europe'

var suffix = prod ? '' : uniqueString(subscription().subscriptionId)
var dashSuffix = prod ? '' : '-${suffix}'
var productionTag = prod ? 'true' : 'false'

targetScope = 'subscription'

resource resourceGroup 'Microsoft.Resources/resourceGroups@2020-10-01' = {
  name: '${appName}${dashSuffix}' 
  location: location
  tags: {
    usage: appName
    production: productionTag
  }
}

module infra './infra.bicep' = {
  name: 'infra'
  scope: resourceGroup
  params: {
    prod: prod
    appName: appName
    location: location
    githubRepo: githubRepo
    githubToken: githubToken
    domainName: domainName
  }
}
