param staticWebAppName string
param domainName string
param tags object

var domains = [
  domainName
  'www.${domainName}'
]

resource staticWebApp 'Microsoft.Web/staticSites@2022-03-01' existing = {
  name: staticWebAppName
}

// resource staticWebAppDomains 'customDomains@2021-01-15' = [for domain in domains: {
//   name: domain
//   properties: {
//     validationMethod: 'dns-txt-token'
//   }    
// }]

resource dnsZones 'Microsoft.Network/dnszones@2018-05-01' = {
  name: domainName
  location: 'global'
  tags: tags
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
