import {
  ICredentialType,
  NodePropertyTypes,
} from 'n8n-workflow';

export class Sapling implements ICredentialType {
  name = 'sapling';
  displayName = 'Sapling API';
  documentationUrl = 'sapling';
  properties = [
      {
          displayName: 'Sapling Subdomain',
          name: 'subdomain',
          type: 'string' as NodePropertyTypes,
          default: '',
          description: 'The sub-domain provided for your Sapling account',
      },
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string' as NodePropertyTypes,
        default: '',
    },
  ];
}
