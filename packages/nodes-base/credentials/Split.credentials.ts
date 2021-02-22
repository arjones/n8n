import {
  ICredentialType,
  NodePropertyTypes,
} from 'n8n-workflow';

export class Split implements ICredentialType {
  name = 'split';
  displayName = 'Split API';
  documentationUrl = 'split';
  properties = [
      {
          displayName: 'API Key',
          name: 'apiKey',
          type: 'string' as NodePropertyTypes,
          default: '',
      },
  ];
}
