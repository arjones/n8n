import {
  IExecuteFunctions,
} from 'n8n-core';

import {
  IDataObject,
  INodeExecutionData,
  INodeParameters,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
import { saplingRequest } from './Sapling.node.functions';

export class Sapling implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Sapling',
    name: 'sapling',
    icon: 'file:sapling.png',
    group: ['transform'],
    version: 1,
    description: 'Consume Sapling API',
    defaults: {
      name: 'Sapling',
      color: '#1A82e2',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'sapling',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Sapling subdomain',
        name: 'subdomain',
        type: 'string',
        default: '',
        required: true,
        description: 'The Id of the workspace you want to get an environment from',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        options: [
          {
            name: 'User',
            value: 'user',
          },
          // {
          //   name: 'Time Off',
          //   value: 'timeoff',
          // },
        ],
        default: 'user',
        required: true,
        description: 'Resource to consume',
      },
      // -- User --
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        displayOptions: {
          show: {
            resource: [
              'user',
            ],
          },
        },
        options: [
          {
            name: 'List',
            value: 'list',
            description: 'Returns all users in the Sapling account.',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Returns the information about a user in the Sapling platform.',
          },
        ],
        default: 'list',
        description: 'The operation to perform.',
      },
      // -- User > List
      {
        displayName: 'Additional Filters',
        name: 'additionalFilters',
        type: 'collection',
        placeholder: 'Add Filters',
        default: {},
        displayOptions: {
          show: {
            resource: [
              'user',
            ],
            operation: [
              'list',
            ],
          },
        },
        options: [
          {
            displayName: 'Department',
            name: 'department',
            type: 'string',
            default: '',
            description: 'Filter by Department which the user belongs',
          },
          {
            displayName: 'Empl. Status',
            description: 'Employment Status',
            name: 'employment_status',
            type: 'options',
            default: '',
            options: [
              {
                name: 'Full-time',
                value: 'Full-time'
              },
              {
                name: 'Part-time',
                value: 'Part-time'
              },
              {
                name: 'Contractor',
                value: 'Contractor'
              },
            ],

          },
          {
            displayName: 'Location',
            name: 'location',
            type: 'string',
            default: '',
            description: 'Office\'s location',
          },
          {
            displayName: 'Status',
            name: 'status',
            type: 'options',
            options: [
              {
                name: 'Active',
                value: 'active'
              },
              {
                name: 'Inactive',
                value: 'inactive'
              },
            ],
            default: '',
            description: 'Filter by User\'s status'
          },
        ],
      },
      {
        displayName: 'User Id (GUID)',
        displayOptions: {
          show: {
            resource: [
              'user',
            ],
            operation: [
              'get',
            ],
          },
        },
        name: 'guid',
        type: 'string',
        required: true,
        default: '',
        description: 'Lookup user information by GUID',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    let responseData;
    const returnData = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    console.log(resource, ' > ', operation)

    const items = this.getInputData();

    for (let i = 0; i < items.length; i++) {
      if (resource === 'user') {
        if (operation === 'list') {
          const filters = this.getNodeParameter('additionalFilters', i) as INodeParameters
          const response = await saplingRequest.call(this, 'GET', 'profiles', undefined, filters)
          responseData = response;

        } else if (operation === 'get') {
          const guid = this.getNodeParameter('guid', i) as string
          console.log('guid', guid)
          const response = await saplingRequest.call(this, 'GET', `profiles/${guid}`)
          responseData = response;

        } else
          new Error(`${resource} > ${operation}: not implemented`);
      } else
        new Error(`${resource} > ${operation}: not implemented`);

      returnData.push(...responseData);
    }
    // console.log(returnData)
    return [this.helpers.returnJsonArray(returnData)];
  }
}
