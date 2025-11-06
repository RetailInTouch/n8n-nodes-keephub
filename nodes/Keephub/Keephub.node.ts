import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { generateApiUrl, acquireApiToken } from './utils/helpers';

export class Keephub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Keephub',
		name: 'keephub',
		icon: 'file:Keephub.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Keephub API',
		defaults: {
			name: 'Keephub',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'keephubApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Auth',
						value: 'auth',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Content',
						value: 'content',
					},
					{
						name: 'Task',
						value: 'task',
					},
					{
						name: 'Form Submission',
						value: 'formSubmission',
					},
				],
				default: 'auth',
			},
			// ==================== AUTH OPERATIONS ====================
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
			// ==================== USER OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['user'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'getUser',
						description: 'Retrieve user information',
					},
				],
				default: 'getUser',
			},
			{
				displayName: 'Search By',
				name: 'searchBy',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUser'],
					},
				},
				options: [
					{
						name: 'User ID',
						value: 'id',
					},
					{
						name: 'Username',
						value: 'username',
					},
					{
						name: 'Group',
						value: 'group',
					},
					{
						name: 'Orgunit',
						value: 'orgunit',
					},
				],
				default: 'id',
				description: 'Choose how to search for users',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUser'],
						searchBy: ['id'],
					},
				},
				default: '',
				placeholder: '63bd885034d0466d11073575',
				description: 'The ID of the user to retrieve',
				required: true,
			},
			{
				displayName: 'Username',
				name: 'username',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUser'],
						searchBy: ['username'],
					},
				},
				default: '',
				placeholder: 'john.doe',
				description: 'Username to search for',
				required: true,
			},
			{
				displayName: 'Group',
				name: 'group',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUser'],
						searchBy: ['group'],
					},
				},
				default: '',
				placeholder: 'group-id',
				description: 'Group ID to filter users by',
				required: true,
			},
			{
				displayName: 'Orgunit',
				name: 'orgunit',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['user'],
						operation: ['getUser'],
						searchBy: ['orgunit'],
					},
				},
				default: '',
				placeholder: 'orgunit-id',
				description: 'Organization unit ID to filter users by',
				required: true,
			},
			// ==================== CONTENT OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['content'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'create',
						description: 'Create new content',
					},
					{
						name: 'Get by ID',
						value: 'getById',
						description: 'Get content by ID',
					},
					{
						name: 'Find by Content Pool',
						value: 'findByContentPool',
						description: 'Find contents by content pool',
					},
					{
						name: 'Find by Group',
						value: 'findByGroup',
						description: 'Find contents by group',
					},
					{
						name: 'Find by Orgunit',
						value: 'findByOrgunit',
						description: 'Find contents by organization unit',
					},
					{
						name: 'Update by ID',
						value: 'updateById',
						description: 'Update content by ID',
					},
					{
						name: 'Delete',
						value: 'delete',
						description: 'Delete content by ID',
					},
				],
				default: 'create',
			},
			// Content ID (for getById, updateById, delete)
			{
				displayName: 'Content ID',
				name: 'contentId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['getById', 'updateById', 'delete'],
					},
				},
				default: '',
				placeholder: '63bd885034d0466d11073575',
				description: 'The ID of the content',
				required: true,
			},
			// CREATE CONTENT FIELDS
			{
				displayName: 'Define',
				name: 'defineContentInput',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['create'],
					},
				},
				options: [
					{
						name: 'Using JSON',
						value: 'json',
					},
				],
				default: 'json',
				description: 'Modify JSON body per your needs.',
			},
			{
				displayName: 'JSON Body',
				name: 'contentBody',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['create'],
						defineContentInput: ['json'],
					},
				},
				default: JSON.stringify(
					{
						originLanguage: 'en/nl',
						contentType: 'add content type',
						contentPool: 'YOUR_POOL_ID',
						title: { en: 'Your Title' },
						message: { en: '<p>Your message</p>' },
						private: false,
						sendPushNotification: false,
						notifyNew: false,
						notifyOnAttendeeActions: false,
						notifyAttendeesOnUpdate: false,
						highlighted: false,
						tags: [],
						mentions: [],
						relatedTags: [],
						social: { reactionsEnabled: true, commentsEnabled: true },
						form: {
							active: true,
							anonymous: false,
							confidential: false,
							confidants: [],
							emails: [''],
							fields: [],
							shareable: false,
						},
						event: {
							widgets: [],
							attendanceType: 'n/a',
							endDate: null,
							deactivationDate: null,
						},
						training: { lessons: [] },
						translationRequest: [],
						status: 'n/a',
						orgchartSelection: { include: ['root0001'], exclude: [] },
						orgchartAttrSelection: { include: [], exclude: [] },
						groups: { selection: [], exclude: false },
						orgunits: [],
					},
					null,
					2,
				),
				required: true,
				placeholder: '{"originLanguage":"en",...}',
			},

			// FIND BY CONTENT POOL
			{
				displayName: 'Content Pool ID',
				name: 'filterContentPoolId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['findByContentPool'],
					},
				},
				default: '',
				placeholder: '63bd885034d0466d11073575',
				description: 'Content pool ID to filter by',
				required: true,
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['findByContentPool', 'findByGroup', 'findByOrgunit'],
					},
				},
				default: 50,
				description: 'Maximum number of results to return',
			},
			// FIND BY GROUP
			{
				displayName: 'Group ID',
				name: 'groupId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['findByGroup'],
					},
				},
				default: '',
				placeholder: 'group-id',
				description: 'Group ID to filter by',
				required: true,
			},
			// FIND BY ORGUNIT
			{
				displayName: 'Orgunit ID',
				name: 'orgunitId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['findByOrgunit'],
					},
				},
				default: '',
				placeholder: 'orgunit-id',
				description: 'Organization unit ID to filter by',
				required: true,
			},
			// UPDATE FIELDS
			{
				displayName: 'Update Fields',
				name: 'updateFields',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['content'],
						operation: ['updateById'],
					},
				},
				default: '{}',
				placeholder: '{"title": {"en": "New title"}}',
				description: 'JSON object with fields to update',
				required: true,
			},
			// ==================== TASK OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['task'],
					},
				},
				options: [
					{
						name: 'Create',
						value: 'createTask',
						description: 'Create a new task template',
					},
					{
						name: 'Edit',
						value: 'editTask',
						description: 'Edit an existing task template',
					},
					{
						name: 'Get Status',
						value: 'getTaskStatus',
						description: 'Get task template status',
					},
					{
						name: 'Get Status Counts',
						value: 'getTaskStatusCounts',
						description: 'Get task template status counts',
					},
					{
						name: 'Delete',
						value: 'deleteTask',
						description: 'Delete a task template',
					},
				],
				default: 'createTask',
			},
			// Define input method for Create Task
			{
				displayName: 'Define',
				name: 'defineTaskInput',
				type: 'options',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask'],
					},
				},
				options: [
					{
						name: 'Using Fields Below',
						value: 'fields',
					},
					{
						name: 'Using JSON',
						value: 'json',
					},
				],
				default: 'fields',
				description: 'How to define the task to create',
			},
			// JSON Body for Create Task
			{
				displayName: 'JSON Body',
				name: 'taskJsonBody',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask'],
						defineTaskInput: ['json'],
					},
				},
				default: '{}',
				placeholder: '{"title":{"en":"Task"},"template":{"form":{"fields":[]}}}',
				description: 'Complete JSON body for task creation',
				required: true,
			},
			// Task ID (for edit, delete, getStatus)
			{
				displayName: 'Task ID',
				name: 'taskId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['editTask', 'deleteTask', 'getTaskStatus', 'getTaskStatusCounts'],
					},
				},
				default: '',
				placeholder: '63bd885034d0466d11073575',
				description: 'The ID of the task',
				required: true,
			},

			// CREATE TASK FIELDS
			{
				displayName: 'Title',
				name: 'taskTitle',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask'],
						defineTaskInput: ['fields'],
					},
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
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask'],
						defineTaskInput: ['fields'],
					},
				},
				default: '',
				placeholder: 'Task description',
				description: 'Message for the task',
			},
			{
				displayName: 'Repeating',
				name: 'repeating',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask'],
						defineTaskInput: ['fields'],
					},
				},
				default: false,
				description: 'Whether this task is repeating',
			},
			{
				displayName: 'Send Notification',
				name: 'taskNotification',
				type: 'boolean',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['createTask'],
						defineTaskInput: ['fields'],
					},
				},
				default: false,
				description: 'Whether to send notifications',
			},
			// Update fields for edit task
			{
				displayName: 'Update Fields',
				name: 'updateTaskFields',
				type: 'json',
				displayOptions: {
					show: {
						resource: ['task'],
						operation: ['editTask'],
					},
				},
				default: '{}',
				placeholder: '{"title":{"en":"Updated title"}}',
				description: 'JSON object with fields to update',
				required: true,
			},
			// ==================== FORM SUBMISSION OPERATIONS ====================
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['formSubmission'],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'getFormSubmission',
						description: 'Fetch full form submission data',
					},
					{
						name: 'Get Submitter Details',
						value: 'getSubmitterDetails',
						description: 'Fetch full user data of the submitter',
					},
					{
						name: 'Get Orgunit Context',
						value: 'getOrgunitContext',
						description: 'Fetch orgunit hierarchy',
					},
					{
						name: 'Update Orgunit',
						value: 'updateFormSubmissionOrgunit',
						description: 'Change submission orgunit to limit visibility',
					},
					{
						name: 'Route by Answer',
						value: 'routeByAnswer',
						description: 'Conditional routing based on field values',
					},
					{
						name: 'Calculate Response Duration',
						value: 'calculateResponseDuration',
						description: 'Time from form creation to submission',
					},
				],
				default: 'getFormSubmission',
			},
			{
				displayName: 'Form Submission ID',
				name: 'formSubmissionId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['formSubmission'],
						operation: [
							'getFormSubmission',
							'getSubmitterDetails',
							'getOrgunitContext',
							'updateFormSubmissionOrgunit',
							'calculateResponseDuration',
							'routeByAnswer',
						],
					},
				},
				default: '',
				placeholder: '63bd885034d0466d11073575',
				description: 'The ID of the form submission',
				required: true,
			},
			{
				displayName: 'New Orgunit ID(s)',
				name: 'newOrgunitId',
				type: 'string',
				displayOptions: {
					show: {
						resource: ['formSubmission'],
						operation: ['updateFormSubmissionOrgunit'],
					},
				},
				default: '',
				placeholder: 'root0001, test0001, root0067',
				description: 'Orgunit ID(s) to assign (comma-separated for multiple)',
				required: true,
			},
			{
				displayName: 'Conditions',
				name: 'conditions',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true, // ← Click to add multiple!
				},
				displayOptions: {
					show: {
						resource: ['formSubmission'],
						operation: ['routeByAnswer'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Condition',
						name: 'conditionValues',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'string',
								placeholder: 'Field label or ID',
								default: '',
							},
							{
								displayName: 'Expected Value',
								name: 'expectedValue',
								type: 'string',
								placeholder: 'Value to match',
								default: '',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const credentials = (await this.getCredentials('keephubApi')) as {
			clientUrl: string;
			authType: string;
			bearerToken?: string;
			username?: string;
			password?: string;
		};

		const baseUrl = generateApiUrl(credentials.clientUrl);
		const authType = credentials.authType;

		const apiToken = await acquireApiToken.call(this);

		for (let i = 0; i < items.length; i++) {
			try {
				// GET RESOURCE/OPERATION FOR EACH ITEM (move this HERE)
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// ==================== AUTH ====================
				if (resource === 'auth') {
					if (operation === 'getToken') {
						returnData.push({
							json: {
								accessToken: apiToken,
								baseUrl: baseUrl,
								authType: authType,
							},
						});
            continue;
					}
				}
				// ==================== USER ====================
				else if (resource === 'user') {
					if (operation === 'getUser') {
						const searchBy = this.getNodeParameter('searchBy', i) as string;

						if (searchBy === 'id') {
							const userId = this.getNodeParameter('userId', i) as string;

							if (!userId.match(/^[a-f\d]{24}$/i)) {
								throw new NodeOperationError(this.getNode(), 'Invalid user ID format', {
									description: `Expected MongoDB ObjectId format (24 hex characters), got: ${userId}`,
									itemIndex: i,
								});
							}

							try {
								const response = (await this.helpers.httpRequest({
									method: 'GET',
									url: `${baseUrl}/users/${userId}`,
									headers: {
										Authorization: `Bearer ${apiToken}`,
										'Content-Type': 'application/json',
									},
								})) as IDataObject;

								returnData.push({ json: response });
							} catch (error: any) {
								if (error.statusCode === 404) {
									throw new NodeOperationError(
										this.getNode(),
										`User not found with ID: ${userId}`,
										{
											itemIndex: i,
										},
									);
								}
								throw new NodeOperationError(
									this.getNode(),
									'Error fetching user. Make sure you are using correct id.',
									{
										description: (error as Error).message,
										itemIndex: i,
									},
								);
							}
						} else {
							let queryParam = '';
							let queryValue = '';

							if (searchBy === 'username') {
								queryValue = this.getNodeParameter('username', i) as string;
								queryParam = `username=${encodeURIComponent(queryValue)}`;
							} else if (searchBy === 'group') {
								queryValue = this.getNodeParameter('group', i) as string;
								queryParam = `groups=${encodeURIComponent(queryValue)}`;
							} else if (searchBy === 'orgunit') {
								queryValue = this.getNodeParameter('orgunit', i) as string;
								queryParam = `orgunits=${encodeURIComponent(queryValue)}`;
							}

							if (!queryValue || queryValue.trim().length === 0) {
								throw new NodeOperationError(this.getNode(), `${searchBy} cannot be empty`, {
									itemIndex: i,
								});
							}

							try {
								const response = (await this.helpers.httpRequest({
									method: 'GET',
									url: `${baseUrl}/users?${queryParam}`,
									headers: {
										Authorization: `Bearer ${apiToken}`,
										'Content-Type': 'application/json',
									},
								})) as IDataObject;

								returnData.push({ json: response });
							} catch (error: any) {
								throw new NodeOperationError(
									this.getNode(),
									`Error searching users by ${searchBy}`,
									{
										description: (error as Error).message,
										itemIndex: i,
									},
								);
							}
						}
					}
				}
				// ==================== CONTENT ====================
				else if (resource === 'content') {
					if (operation === 'create') {
						const body = this.getNodeParameter('contentBody', i) as IDataObject;

						try {
							const response = await this.helpers.httpRequest({
								method: 'POST',
								url: `${baseUrl}/contents`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
								body,
							});

							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error creating content', {
								description: error?.response?.data?.message || error.message,
								itemIndex: i,
							});
						}
					} else if (operation === 'getById') {
						const contentId = this.getNodeParameter('contentId', i) as string;

						try {
							const response = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/contents/${contentId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as IDataObject;

							if (!response || Object.keys(response).length === 0) {
								throw new NodeOperationError(
									this.getNode(),
									`Content not found with ID: ${contentId}`,
									{ itemIndex: i },
								);
							}

							returnData.push({ json: response });
						} catch (error: any) {
							if (error.statusCode === 404) {
								throw new NodeOperationError(
									this.getNode(),
									`Content not found with ID: ${contentId}`,
									{ itemIndex: i },
								);
							}
							throw new NodeOperationError(
								this.getNode(),
								'Error fetching content. Content does not exist. Ensure you are using correct id.',
								{
									description: (error as Error).message,
									itemIndex: i,
								},
							);
						}
					} else if (operation === 'findByContentPool') {
						const filterContentPoolId = this.getNodeParameter('filterContentPoolId', i) as string;
						const limit = this.getNodeParameter('limit', i, 10) as number; // Get limit parameter or default to 10

						try {
							const url = `${baseUrl}/contentsview?$limit=${limit}&$skip=0&$and[0][contentPool]=${encodeURIComponent(filterContentPoolId)}`;

							const response = (await this.helpers.httpRequest({
								method: 'GET',
								url: url,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							if (Array.isArray(response)) {
								response.forEach((item: any) => {
									returnData.push({ json: item });
								});
							} else {
								returnData.push({ json: response });
							}
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error searching content by pool', {
								description: error?.response?.data?.message || error.message,
								itemIndex: i,
							});
						}
					} else if (operation === 'findByGroup') {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;

						try {
							const response = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/contentsview?$limit=${limit}&$and[0][groups.selection]=${encodeURIComponent(groupId)}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as IDataObject;

							if (!response || (Array.isArray(response) && response.length === 0)) {
								throw new NodeOperationError(
									this.getNode(),
									`No content found in group: ${groupId}`,
									{ itemIndex: i },
								);
							}

							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error searching content by group', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'findByOrgunit') {
						const orgunitId = this.getNodeParameter('orgunitId', i) as string;
						const limit = this.getNodeParameter('limit', i) as number;

						try {
							const response = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/contentsview?$limit=${limit}&$and[0][orgchartSelection.include]=${encodeURIComponent(
									orgunitId,
								)}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as IDataObject;

							if (!response || (Array.isArray(response) && response.length === 0)) {
								throw new NodeOperationError(
									this.getNode(),
									`No content found in organization unit: ${orgunitId}`,
									{ itemIndex: i },
								);
							}

							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error searching content by orgunit', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'updateById') {
						const contentId = this.getNodeParameter('contentId', i) as string;
						const updateFieldsInput = this.getNodeParameter('updateFields', i) as unknown;

						let updateFields: IDataObject;
						if (typeof updateFieldsInput === 'string') {
							try {
								updateFields = JSON.parse(updateFieldsInput) as IDataObject;
							} catch (error) {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON in Update Fields', {
									description: 'Please check your JSON syntax',
									itemIndex: i,
								});
							}
						} else {
							updateFields = updateFieldsInput as IDataObject;
						}

						try {
							const response = (await this.helpers.httpRequest({
								method: 'PUT',
								url: `${baseUrl}/contents/${contentId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
								body: updateFields,
							})) as IDataObject;

							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error updating content', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'delete') {
						const contentId = this.getNodeParameter('contentId', i) as string;

						try {
							const response = (await this.helpers.httpRequest({
								method: 'DELETE',
								url: `${baseUrl}/contents/${contentId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as IDataObject;

							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error deleting content', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					}
					// ==================== TASK ====================
				} else if (resource === 'task') {
					if (operation === 'createTask') {
						const defineInput = this.getNodeParameter('defineTaskInput', i) as string;

						let body: IDataObject;

						if (defineInput === 'json') {
							const jsonBodyInput = this.getNodeParameter('taskJsonBody', i) as unknown;

							if (typeof jsonBodyInput === 'string') {
								try {
									body = JSON.parse(jsonBodyInput) as IDataObject;
								} catch (error) {
									throw new NodeOperationError(this.getNode(), 'Invalid JSON in Task JSON Body', {
										description: 'Please check your JSON syntax',
										itemIndex: i,
									});
								}
							} else {
								body = jsonBodyInput as IDataObject;
							}
						} else {
							const title = this.getNodeParameter('taskTitle', i) as string;
							const message = this.getNodeParameter('taskMessage', i) as string;
							const repeating = this.getNodeParameter('repeating', i) as boolean;
							const notification = this.getNodeParameter('taskNotification', i) as boolean;

							body = {
								title: { en: title },
								message: { en: message },
								repeating,
								sendPushNotification: notification,
								template: {
									form: {
										fields: [],
									},
								},
							};
						}

						try {
							const response = (await this.helpers.httpRequest({
								method: 'POST',
								url: `${baseUrl}/tasktemplates`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
								body,
							})) as IDataObject;

							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error creating task', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'editTask') {
						const taskId = this.getNodeParameter('taskId', i) as string;
						const updateFieldsInput = this.getNodeParameter('updateTaskFields', i) as unknown;

						let updateFields: IDataObject;
						if (typeof updateFieldsInput === 'string') {
							try {
								updateFields = JSON.parse(updateFieldsInput) as IDataObject;
							} catch (error) {
								throw new NodeOperationError(this.getNode(), 'Invalid JSON in Update Fields', {
									description: 'Please check your JSON syntax',
									itemIndex: i,
								});
							}
						} else {
							updateFields = updateFieldsInput as IDataObject;
						}

						try {
							const response = (await this.helpers.httpRequest({
								method: 'PUT',
								url: `${baseUrl}/tasktemplates/${taskId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
								body: updateFields,
							})) as IDataObject;

							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error updating task', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'getTaskStatus') {
						const taskId = this.getNodeParameter('taskId', i) as string;

						try {
							const response = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/tasktemplates/${taskId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							const progressArray = response.progress || [];
							const progressData = progressArray[0] || {};

							returnData.push({
								json: {
									id: response._id,
									fullProgress: [
										{
											done: progressData.done,
											open: progressData.open,
											approval: progressData.approval,
											status: progressData.status,
											orgUnitsTasksStatus: progressData.orgUnitsTasksStatus,
										},
									],
								},
							});
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error getting task status', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'getTaskStatusCounts') {
						const taskId = this.getNodeParameter('taskId', i) as string;

						try {
							const response = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/tasktemplates/${taskId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							const progressArray = response.progress || [];
							const progressData = progressArray[0] || {};

							returnData.push({
								json: {
									done: progressData.done,
									open: progressData.open,
									approval: progressData.approval,
									status: progressData.status,
								},
							});
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error getting task status counts', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'deleteTask') {
						const taskId = this.getNodeParameter('taskId', i) as string;

						try {
							const response = (await this.helpers.httpRequest({
								method: 'DELETE',
								url: `${baseUrl}/tasktemplates/${taskId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as IDataObject;
							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error deleting task', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
						try {
							const response = (await this.helpers.httpRequest({
								method: 'DELETE',
								url: `${baseUrl}/tasktemplates/${taskId}/instance`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as IDataObject;
							returnData.push({ json: response });
						} catch (error: any) {
							throw new NodeOperationError(this.getNode(), 'Error deleting task instance', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					}

					// ==================== FORM SUBMISSION ====================
				} else if (resource === 'formSubmission') {
					if (operation === 'getFormSubmission') {
						const formSubmissionId = this.getNodeParameter('formSubmissionId', i) as string;

						if (!formSubmissionId.match(/^[a-f\d]{24}$/i)) {
							throw new NodeOperationError(this.getNode(), 'Invalid form submission ID format', {
								itemIndex: i,
							});
						}

						try {
							const formSubmission = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/formvalues/${formSubmissionId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							if (!formSubmission) {
								throw new NodeOperationError(
									this.getNode(),
									`Form submission not found: ${formSubmissionId}`,
									{ itemIndex: i },
								);
							}

							returnData.push({ json: formSubmission });
						} catch (error: any) {
							if (error.statusCode === 404) {
								throw new NodeOperationError(
									this.getNode(),
									`Form submission not found with ID: ${formSubmissionId}`,
									{ itemIndex: i },
								);
							}
							throw new NodeOperationError(this.getNode(), 'Error fetching form submission', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'getSubmitterDetails') {
						const formSubmissionId = this.getNodeParameter('formSubmissionId', i) as string;

						if (!formSubmissionId.match(/^[a-f\d]{24}$/i)) {
							throw new NodeOperationError(this.getNode(), 'Invalid form submission ID format', {
								itemIndex: i,
							});
						}

						try {
							const formSubmission = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/formvalues/${formSubmissionId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							if (!formSubmission || !formSubmission.createdBy) {
								throw new NodeOperationError(
									this.getNode(),
									'Form submission or submitter not found',
									{ itemIndex: i },
								);
							}

							const submitterId =
								typeof formSubmission.createdBy === 'string'
									? formSubmission.createdBy
									: formSubmission.createdBy._id;

							const submitterData = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/users/${submitterId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							returnData.push({ json: submitterData });
						} catch (error: any) {
							if (error.statusCode === 404) {
								throw new NodeOperationError(this.getNode(), 'Submitter not found', {
									itemIndex: i,
								});
							}
							throw new NodeOperationError(this.getNode(), 'Error fetching submitter details', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'getOrgunitContext') {
						const formSubmissionId = this.getNodeParameter('formSubmissionId', i) as string;

						if (!formSubmissionId.match(/^[a-f\d]{24}$/i)) {
							throw new NodeOperationError(this.getNode(), 'Invalid form submission ID format', {
								itemIndex: i,
							});
						}

						try {
							const formSubmission = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/formvalues/${formSubmissionId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							if (!formSubmission || !formSubmission.createdBy) {
								throw new NodeOperationError(
									this.getNode(),
									'Form submission or submitter not found',
									{ itemIndex: i },
								);
							}

							const submitterId =
								typeof formSubmission.createdBy === 'string'
									? formSubmission.createdBy
									: formSubmission.createdBy._id;

							const submitterData = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/users/${submitterId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							// Fetch each orgunit details
							const orgunitDetails: any[] = [];

							for (const orgunitId of submitterData.orgunits || []) {
								try {
									const orgunitData = (await this.helpers.httpRequest({
										method: 'GET',
										url: `${baseUrl}/orgchart/${orgunitId}`,
										headers: {
											Authorization: `Bearer ${apiToken}`,
											'Content-Type': 'application/json',
										},
									})) as any;

									orgunitDetails.push({
										id: orgunitId,
										name: orgunitData.name || 'Unknown',
										path: (orgunitData.namepath || '').slice(1),
									});
								} catch (err) {
									// Skip if orgunit fetch fails
									orgunitDetails.push({
										id: orgunitId,
										name: 'Error fetching',
										path: '',
									});
								}
							}

							returnData.push({
								json: {
									_id: submitterData._id,
									name: submitterData.name,
									orgunits: orgunitDetails,
								},
							});
						} catch (error: any) {
							if (error.statusCode === 404) {
								throw new NodeOperationError(this.getNode(), 'Submitter not found', {
									itemIndex: i,
								});
							}
							throw new NodeOperationError(this.getNode(), 'Error fetching orgunit context', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'updateFormSubmissionOrgunit') {
						const formSubmissionId = this.getNodeParameter('formSubmissionId', i) as string;
						const newOrgunitIds = this.getNodeParameter('newOrgunitId', i) as string;

						const orgunitArray = newOrgunitIds
							.split(',')
							.map((id: string) => id.trim())
							.filter((id: string) => id.length > 0);

						try {
							const formSubmission = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/formvalues/${formSubmissionId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							const contentRef = formSubmission.contentRef._id || formSubmission.contentRef;

							// Try $set operator (MongoDB style)
							const response = (await this.helpers.httpRequest({
								method: 'PATCH',
								url: `${baseUrl}/formvalues/${formSubmissionId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
								body: {
									contentRef: contentRef,
									values: formSubmission.values,
									$set: {
										orgunitsOfCreator: orgunitArray,
									},
								},
							})) as any;

							returnData.push({
								json: {
									success: true,
									message: 'Updated orgunitsOfCreator',
									orgunitsOfCreator: orgunitArray,
								},
							});
						} catch (error: any) {
							returnData.push({
								json: {
									success: false,
									error: error.message,
									statusCode: error.statusCode,
									errorData: error.response?.data || null,
								},
							});
						}
					} else if (operation === 'calculateResponseDuration') {
						const formSubmissionId = this.getNodeParameter('formSubmissionId', i) as string;

						try {
							// Get form submission first to extract contentRef ID
							const formSubmission = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/formvalues/${formSubmissionId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							if (!formSubmission || !formSubmission.contentRef) {
								throw new NodeOperationError(
									this.getNode(),
									'Form submission or contentRef not found',
									{ itemIndex: i },
								);
							}

							const contentId = formSubmission.contentRef._id || formSubmission.contentRef;

							// Now fetch the form/content to get creation time
							const contentRef = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/contents/${contentId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							const createdAt = new Date(contentRef.createdAt).getTime();
							const submittedAt = new Date(formSubmission.createdAt).getTime();
							const durationMs = submittedAt - createdAt;

							const durationSecs = Math.floor(durationMs / 1000);
							const durationMins = Math.floor(durationSecs / 60);
							const durationHours = Math.floor(durationMins / 60);
							const durationDays = Math.floor(durationHours / 24);

							returnData.push({
								json: {
									formId: contentId,
									formCreatedAt: contentRef.createdAt,
									submittedAt: formSubmission.createdAt,
									duration: {
										timeSinceFormCreated: `${durationDays}d ${durationHours % 24}h ${durationMins % 60}m`,
									},
								},
							});
						} catch (error: any) {
							if (error.statusCode === 404) {
								throw new NodeOperationError(
									this.getNode(),
									'Form submission or content not found',
									{ itemIndex: i },
								);
							}
							throw new NodeOperationError(this.getNode(), 'Error calculating response duration', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					} else if (operation === 'routeByAnswer') {
						const formSubmissionId = this.getNodeParameter('formSubmissionId', i) as string;
						const conditionsData =
							(this.getNodeParameter('conditions.conditionValues', i) as any[]) || [];

						try {
							const formSubmission = (await this.helpers.httpRequest({
								method: 'GET',
								url: `${baseUrl}/formvalues/${formSubmissionId}`,
								headers: {
									Authorization: `Bearer ${apiToken}`,
									'Content-Type': 'application/json',
								},
							})) as any;

							if (!formSubmission) {
								throw new NodeOperationError(this.getNode(), 'Form submission not found', {
									itemIndex: i,
								});
							}

							const form = formSubmission.contentRef?.form;
							const values = formSubmission.values || [];

							// Build answer map
							const answerMap: any = {};
							for (const value of values) {
								const field = form?.fields?.find((f: any) => f.id === value.ffId);
								const fieldLabel = field?.label?.nl || field?.label?.en || value.ffId;
								answerMap[fieldLabel] = value.value?.value || value.value;
								answerMap[value.ffId] = value.value?.value || value.value;
							}

							// Evaluate conditions
							let allMatch = true;
							const evaluatedConditions: any[] = [];

							if (conditionsData && Array.isArray(conditionsData) && conditionsData.length > 0) {
								for (const condition of conditionsData) {
									const { fieldName, expectedValue } = condition;
									const actualValue = answerMap[fieldName];
									const matches = String(actualValue) === String(expectedValue);

									evaluatedConditions.push({
										fieldName,
										expectedValue,
										actualValue,
										matches,
									});

									if (!matches) allMatch = false;
								}
							}

							returnData.push({
								json: {
									formSubmissionId,
									allConditionsMatch: allMatch,
									route: allMatch ? 'proceed' : 'stop',
									conditions: evaluatedConditions,
									allAnswers: Object.entries(answerMap).map(([key, value]) => ({
										fieldId: key,
										value,
									})),
								},
							});
						} catch (error: any) {
							if (error instanceof NodeOperationError) throw error;
							throw new NodeOperationError(this.getNode(), 'Error routing by answer', {
								description: (error as Error).message,
								itemIndex: i,
							});
						}
					}
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error instanceof NodeOperationError ? error.message : (error as Error).message,
						},
					});
				} else {
					throw error;
				}
			}
		}
		return [returnData];
	}
}
