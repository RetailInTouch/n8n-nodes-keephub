import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { apiRequest, parseJsonParameter } from '../../utils/helpers';

export const description = {
	displayName: 'Create',
	name: 'createTask',
	action: 'Create task template',
	description: 'Create a new task template',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const defineInput = this.getNodeParameter('defineTaskInput', index) as string;

	// Get language from credentials
	const credentials = (await this.getCredentials('keephubApi')) as {
		language?: string;
	};

	const language = credentials.language || 'en';
	let body: IDataObject;

	if (defineInput === 'json') {
		const jsonBodyInput = this.getNodeParameter('taskJsonBody', index) as unknown;
		body = parseJsonParameter.call(this, jsonBodyInput, 'Task JSON Body', index);
	} else {
		const title = this.getNodeParameter('taskTitle', index) as string;
		const message = this.getNodeParameter('taskMessage', index, '') as string;
		const notification = this.getNodeParameter('taskNotification', index, false) as boolean;

		const today = new Date();
		const startDate = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }));
		startDate.setDate(startDate.getDate() - 1);
		startDate.setHours(23, 0, 0, 0);

		const dueDate = new Date(today.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }));
		dueDate.setDate(dueDate.getDate() + 1);
		dueDate.setHours(22, 59, 59, 999);

		body = {
			originLanguage: language,
			sendPushNotification: notification,
			orgchartSelection: {
				include: ['root0001'],
				exclude: [],
			},
			orgchartAttrSelection: [],
			groups: [],
			type: 'single',
			customRule: {
				freq: 'WEEKLY',
				interval: 1,
				dtstart: [today.getFullYear(), today.getMonth() + 1, today.getDate(), 0, 0],
				until: null,
			},
			repeatEvery: 1,
			parentRef: null,
			template: {
				startDate: startDate.toISOString(),
				dueDate: dueDate.toISOString(),
				completionType: 'group',
				timezone: 'Europe/Amsterdam',
				title: { [language]: title },
				attachments: { [language]: [] },
				relatedTags: [],
				form: {
					active: true,
					fields: [
						{
							id: 'auto',
							required: false,
							element: 'Paragraph',
							static: true,
							bold: false,
							italic: false,
							content: '',
							text: {
								[language]: message,
							},
							type: '',
							editingFieldId: '',
							sectionIndex: null,
							insideSection: null,
							orderIndex: 0,
						},
					],
				},
				highlighted: false,
				templateEndDate: null,
			},
		};
	}

	const response = await apiRequest.call(this, 'POST', '/tasktemplates', body);

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
