import { INodeProperties } from 'n8n-workflow';

export const orgchartFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['orgchart'],
			},
		},
		options: [
			{
				name: 'Get by ID',
				value: 'getById',
				description: 'Get a single orgchart node by ID',
				action: 'Get an orgchart node',
			},
			{
				name: 'Get Parent',
				value: 'getParent',
				description: 'Get the parent of an orgchart node by ID',
				action: 'Get parent of an orgchart node',
			},
			{
				name: 'Get Ancestors',
				value: 'getAncestors',
				description: 'Get all ancestors of an orgchart node by ID',
				action: 'Get ancestors of an orgchart node',
			},
			{
				name: 'Get Children',
				value: 'getChildren',
				description: 'Get all children/descendants of an orgchart node by ID',
				action: 'Get children of an orgchart node',
			},
		],
		default: 'getById',
	},
	{
		displayName: 'Node ID',
		name: 'nodeId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['orgchart'],
			},
		},
		placeholder: 'e.g., 123456',
		description: 'The ID of the orgchart node to operate on',
	},
	{
		displayName: 'Depth Limit',
		name: 'depthLimit',
		type: 'number',
		default: 0,
		displayOptions: {
			show: {
				resource: ['orgchart'],
				operation: ['getAncestors'],
			},
		},
		description: 'Maximum depth to traverse (0 = unlimited)',
	},
	{
		displayName: 'Result Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: {
				resource: ['orgchart'],
				operation: ['getChildren'],
			},
		},
		description: 'Max number of results to return',
	},
];
