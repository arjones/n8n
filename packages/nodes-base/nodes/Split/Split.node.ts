import {
  IExecuteFunctions,
} from 'n8n-core';

import {
  IDataObject,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { splitRequest } from './Split.node.functions';

export class Split implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Split',
    name: 'split',
    icon: 'file:split.png',
    group: ['transform'],
    version: 1,
    description: 'Consume Split API',
    defaults: {
      name: 'Split',
      color: '#1A82e2',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'split',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          {
            name: 'Workspace',
            value: 'workspace',
          },
          {
            name: 'Environment',
            value: 'environment',
          },
          {
            name: 'Segment',
            value: 'segment',
          },
        ],
        default: 'workspace',
        required: true,
        description: 'Resource to consume',
      },
      // -- Workspace --
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'workspace',
            ],
          },
        },
        options: [
          {
            name: 'List',
            value: 'list',
            description: 'Retrieves the workspaces for an organization.',
          },
        ],
        default: 'list',
        description: 'The operation to perform.',
      },
      // -- Environments --
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'environment',
            ],
          },
        },
        options: [
          {
            name: 'List',
            value: 'list',
            description: 'Retrieves the environments for a workspace.',
          },
        ],
        default: 'list',
        description: 'The operation to perform.',
      },
      {
        displayName: 'Workspace ID',
        name: 'workspaceId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: [
              'list',
            ],
            resource: [
              'environment',
            ],
          },
        },
        default: '',
        description: 'The Id of the workspace you want to get an environment from',
      },
      // -- Segment --
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'segment',
            ],
          },
        },
        options: [
          {
            name: 'List',
            value: 'list',
            description: 'List Segments in Environment',
          },
          {
            name: 'Update Keys',
            value: 'updateKeys',
            description: 'Update a list of identifiers to a Segment. The segment must exist before calling this method.',
          },
        ],
        default: 'list',
        description: 'Retrieves the Segments given an environment.',
      },
      {
        displayName: 'Workspace ID',
        name: 'workspaceId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: [
              'list',
            ],
            resource: [
              'segment',
            ],
          },
        },
        default: '',
        description: 'The Id of the workspace you want to get an environment from',
      },
      {
        displayName: 'Environment',
        name: 'environmentId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: [
              'list',
              'updateKeys',
            ],
            resource: [
              'segment',
            ],
          },
        },
        default: '',
        description: 'The id or case sensitive name of the environment in which you want get the segments',
      },
      {
        displayName: 'Segment Name',
        name: 'segmentName',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: [
              'updateKeys',
            ],
            resource: [
              'segment',
            ],
          },
        },
        default: '',
        description: 'The name of the segment you want to create',
      },
      {
        displayName: 'Key to Add',
        name: 'key',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            operation: [
              'updateKeys',
            ],
            resource: [
              'segment',
            ],
          },
        },
        default: '',
        description: 'The segment keys',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    let responseData;
    const returnData = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const items = this.getInputData();

    for (let i = 0; i < items.length; i++) {
      if (resource === 'workspace') {
        if (operation === 'list') {
          const response = await splitRequest.call(this, 'GET', 'workspaces')
          responseData = response.objects;
        }

      } else if (resource === 'environment') {
        if (operation === 'list') {
          const workspaceId = this.getNodeParameter('workspaceId', i) as string;
          const response = await splitRequest.call(this, 'GET',
            `environments/ws/${workspaceId}`)
          responseData = response;
        }

      } else if (resource === 'segment') {
        // List Segments in Environment
        if (operation === 'list') {
          // https://docs.split.io/reference#list-segments-in-environment
          const workspaceId = this.getNodeParameter('workspaceId', i) as string;
          const environmentId = this.getNodeParameter('environmentId', i) as string;
          const response = await splitRequest.call(this, 'GET',
            `segments/ws/${workspaceId}/environments/${environmentId}`)
          responseData = response.objects;

        } else if (operation === 'updateKeys') {
          // https://docs.split.io/reference#update-segment-keys-in-environment-via-json
          const environmentId = this.getNodeParameter('environmentId', i) as string;
          const segmentName = this.getNodeParameter('segmentName', i) as string;
          const key = this.getNodeParameter('key', i) as string;
          console.log('environmentId:', environmentId, 'segmentName:', segmentName, 'key:', key)

          // const response = await splitRequest.call(this, 'GET',
          //   `segments/ws/${workspaceId}/environments/${environmentId}`)
          // responseData = response.objects;

          // curl -v -X PUT \
          // -H 'Content-Type:application/json' \
          // -d '{"keys":["id1", "id2", "id3"], "comment":"a comment"}' \
          // -H 'Authorization: Bearer ADMIN_API_KEY' \
          // https://api.split.io/internal/api/v2/segments/<ENVIRONMENT_ID>/segment_1/uploadKeys

        }
      }
      returnData.push(...responseData);
    }
    console.log(returnData)
    // console.log([this.helpers.returnJsonArray(returnData)])
    return [this.helpers.returnJsonArray(returnData)];
  }
}
