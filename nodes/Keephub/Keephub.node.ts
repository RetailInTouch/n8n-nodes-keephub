import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import * as userActions from './actions/user';
import * as contentActions from './actions/content';
import * as taskActions from './actions/task';
import * as formSubmissionActions from './actions/formSubmission/index';
import * as orgchartActions from './actions/orgchart/index';
import { authFields } from './descriptions/AuthDescription';
import { userFields } from './descriptions/UserDescription';
import { contentFields } from './descriptions/ContentDescription';
import { taskFields } from './descriptions/TaskDescription';
import { formSubmissionFields } from './descriptions/FormSubmissionDescription';
import { orgchartFields } from './descriptions/OrgchartDescription';

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
					{ name: 'Auth', value: 'auth' },
					{ name: 'User', value: 'user' },
					{ name: 'Content', value: 'content' },
					{ name: 'Task', value: 'task' },
					{ name: 'Form Submission', value: 'formSubmission' },
					{ name: 'Orgchart', value: 'orgchart' },
				],
				default: 'auth',
			},
			...authFields,
			...userFields,
			...contentFields,
			...taskFields,
			...formSubmissionFields,
			...orgchartFields,
		] as INodeProperties[],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operationMap = {
			user: {
				getById: userActions.getByIdExecute,
				findByLoginName: userActions.findByLoginNameExecute,
				findByGroup: userActions.findByGroupExecute,
				findByOrgunit: userActions.findByOrgunitExecute,
			},
			content: {
				create: contentActions.createExecute,
				getById: contentActions.getByIdExecute,
				findByContentPool: contentActions.findByContentPoolExecute,
				findByGroup: contentActions.findByGroupExecute,
				findByOrgunit: contentActions.findByOrgunitExecute,
				updateById: contentActions.updateByIdExecute,
				delete: contentActions.deleteExecute,
			},
			task: {
				getTask: taskActions.getByIdExecute,
				createTask: taskActions.createTaskExecute,
				getTaskStatus: taskActions.getTaskStatusExecute,
				getTaskStatusCounts: taskActions.getTaskStatusCountsExecute,
				deleteTask: taskActions.deleteTaskExecute,
			},
			formSubmission: {
				getFormSubmission: formSubmissionActions.getByIdExecute,
				getSubmitterDetails: formSubmissionActions.getSubmitterDetailsExecute,
				getSubmissionOrgunits: formSubmissionActions.getSubmissionOrgunitsExecute,
				updateSubmissionOrgunits: formSubmissionActions.updateSubmissionOrgunitsExecute,
				calculateResponseDuration: formSubmissionActions.calculateResponseDurationExecute,
			},
			orgchart: {
				getById: orgchartActions.getByIdExecute,
				getParent: orgchartActions.getParentExecute,
				getAncestors: orgchartActions.getAncestorsExecute,
				getChildren: orgchartActions.getChildrenExecute,

			},
		};

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		const handler = (operationMap as any)[resource]?.[operation];
		if (!handler) {
			throw new NodeOperationError(
				this.getNode(),
				`Unknown operation "${operation}" for resource "${resource}"`,
			);
		}

		for (let i = 0; i < items.length; i++) {
			try {
				const result = await handler.call(this, items[i], i);
				returnData.push(...result);
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error instanceof Error ? error.message : 'Unknown error' },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
