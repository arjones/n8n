import {
	INodeProperties,
} from 'n8n-workflow';

export const coorganizerOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		default: 'get',
		description: 'Operation to perform',
		options: [
			{
				name: 'Create',
				value: 'create',
			},
			{
				name: 'Delete',
				value: 'delete',
			},
			{
				name: 'Get All',
				value: 'getAll',
			},
			{
				name: 'Reinvite',
				value: 'reinvite',
			},
		],
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
			},
		},
	},
] as INodeProperties[];

export const coorganizerFields = [
	// ----------------------------------
	//         coorganizer: create
	// ----------------------------------
	{
		displayName: 'Given Name',
		name: 'givenName',
		type: 'string',
		required: true,
		default: '',
		description: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		description: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Webinar Key',
		name: 'webinarKey',
		type: 'string',
		required: true,
		default: '',
		description: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Is External',
		name: 'isExternal',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether the co-organizer has no GoToWebinar account.',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'create',
				],
			},
		},
	},
	{
		displayName: 'Organizer Key',
		name: 'organizerKey',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'create',
				],
				isExternal: [
					false,
				],
			},
		},
	},

	// ----------------------------------
	//         coorganizer: delete
	// ----------------------------------
	{
		displayName: 'Webinar Key',
		name: 'webinarKey',
		type: 'string',
		required: true,
		default: '',
		description: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'delete',
				],
			},
		},
	},
	{
		displayName: 'Organizer Key',
		name: 'organizerKey',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'delete',
				],
			},
		},
	},
	{
		displayName: 'Is External',
		name: 'isExternal',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether the co-organizer has no GoToWebinar account.',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'delete',
				],
			},
		},
	},

	// ----------------------------------
	//        coorganizer: getAll
	// ----------------------------------
	{
		displayName: 'Webinar Key',
		name: 'webinarKey',
		type: 'string',
		required: true,
		default: '',
		description: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		description: 'Return all results.',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'getAll',
				],
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 10,
		description: 'The number of results to return.',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'getAll',
				],
				returnAll: [
					false,
				],
			},
		},
	},

	// ----------------------------------
	//      coorganizer: reinvite
	// ----------------------------------
	{
		displayName: 'Webinar Key',
		name: 'webinarKey',
		type: 'string',
		required: true,
		default: '',
		description: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'reinvite',
				],
			},
		},
	},
	{
		displayName: 'Co-Organizer Key',
		name: 'coorganizerKey',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'reinvite',
				],
			},
		},
	},
	{
		displayName: 'Is External',
		name: 'isExternal',
		type: 'boolean',
		required: true,
		default: false,
		description: 'Whether the co-organizer has no GoToWebinar account.',
		displayOptions: {
			show: {
				resource: [
					'coorganizer',
				],
				operation: [
					'reinvite',
				],
			},
		},
	},
] as INodeProperties[];
