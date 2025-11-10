export const authFields = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['auth'],
			},
		},
		options: [
			{
				name: 'Get Token',
				value: 'getToken',
				description: 'Get authentication token from credentials',
			},
		],
		default: 'getToken',
	},
];
