export const taskFields = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['task'] } },
		options: [
			{ name: 'Get by ID', value: 'getTask', description: 'Get a task template by ID' },
			{ name: 'Create', value: 'createTask', description: 'Create a new task template' },
			{ name: 'Get Status', value: 'getTaskStatus', description: 'Get task template status' },
			{
				name: 'Get Status Counts',
				value: 'getTaskStatusCounts',
				description: 'Get task template status counts',
			},
			{ name: 'Delete', value: 'deleteTask', description: 'Delete a task template' },
		],
		default: 'createTask',
	},
	{
		displayName: 'Define',
		name: 'defineTaskInput',
		type: 'options',
		displayOptions: { show: { resource: ['task'], operation: ['createTask'] } },
		options: [
			{ name: 'Using Fields Below', value: 'fields' },
			{ name: 'Using JSON', value: 'json' },
		],
		default: 'fields',
		description: 'How to define the task to create',
	},
	{
		displayName: 'JSON Body',
		name: 'taskJsonBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['task'], operation: ['createTask'], defineTaskInput: ['json'] },
		},
		default: '{}',
		placeholder: '{"title":{"en":"Task"},"template":{"form":{"fields":[]}}}',
		description: 'Complete JSON body for task creation',
		required: true,
	},
	{
		displayName: 'Task ID',
		name: 'taskId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['task'],
				operation: ['getTask', 'deleteTask', 'getTaskStatus', 'getTaskStatusCounts'],
			},
		},
		default: '',
		placeholder: '63bd885034d0466d11073575',
		description: 'The ID of the task',
		required: true,
	},
	{
		displayName: 'Title',
		name: 'taskTitle',
		type: 'string',
		displayOptions: {
			show: { resource: ['task'], operation: ['createTask'], defineTaskInput: ['fields'] },
		},
		default: '',
		placeholder: 'Task title',
		description: 'Title of the task',
		required: true,
	},
	{
		displayName: 'Message',
		name: 'taskMessage',
		type: 'string',
		typeOptions: { rows: 4 },
		displayOptions: {
			show: { resource: ['task'], operation: ['createTask'], defineTaskInput: ['fields'] },
		},
		default: '',
		placeholder: 'Task description',
		description: 'Message for the task',
	},
	{
		displayName: 'Send Notification',
		name: 'taskNotification',
		type: 'boolean',
		displayOptions: {
			show: { resource: ['task'], operation: ['createTask'], defineTaskInput: ['fields'] },
		},
		default: false,
		description: 'Whether to send notifications',
	},
];
