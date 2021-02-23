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
          displayName: 'API Key',
          name: 'apiKey',
          type: 'string' as NodePropertyTypes,
          default: '',
      },
  ];
}
