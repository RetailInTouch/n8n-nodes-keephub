import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import * as contentActions from './actions/content';
import * as formSubmissionActions from './actions/formSubmission/index';
import * as orgchartActions from './actions/orgchart/index';
import * as userActions from './actions/user';
import * as taskActions from './actions/task';
import { contentFields } from './descriptions/ContentDescription';
import { formSubmissionFields } from './descriptions/FormSubmissionDescription';
import { orgchartFields } from './descriptions/OrgchartDescription';
import { taskFields } from './descriptions/TaskDescription';
import { userFields } from './descriptions/UserDescription';

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
					{ name: 'Content', value: 'content' },
					{ name: 'Form Submission', value: 'formSubmission' },
					{ name: 'Orgchart', value: 'orgchart' },
					{ name: 'Task', value: 'task' },
					{ name: 'User', value: 'user' },
				],
				default: 'content',
			},
			...contentFields,
			...formSubmissionFields,
			...orgchartFields,
			...taskFields,
			...userFields,
		] as INodeProperties[],
		usableAsTool: true,
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operationMap = {
			content: {
				create: contentActions.createExecute,
				getById: contentActions.getByIdExecute,
				findByContentPool: contentActions.findByContentPoolExecute,
				findByGroup: contentActions.findByGroupExecute,
				findByOrgunit: contentActions.findByOrgunitExecute,
				updateById: contentActions.updateByIdExecute,
				delete: contentActions.deleteExecute,
			},
			formSubmission: {
				getFormSubmission: formSubmissionActions.getByIdExecute,
				getSubmitterDetails: formSubmissionActions.getSubmitterDetailsExecute,
				getSubmissionOrgunits: formSubmissionActions.getSubmissionOrgunitsExecute,
				updateSubmissionOrgunits: formSubmissionActions.updateSubmissionOrgunitsExecute,
				calculateResponseDuration: formSubmissionActions.calculateResponseDurationExecute,
			},
			orgchart: {
				getByExternalRef: orgchartActions.getByExternalRefExecute,
				getById: orgchartActions.getByIdExecute,
				getParent: orgchartActions.getParentExecute,
				getAncestors: orgchartActions.getAncestorsExecute,
				getChildren: orgchartActions.getChildrenExecute,
			},
			task: {
				getTask: taskActions.getByIdExecute,
				createTask: taskActions.createTaskExecute,
				getTaskProgress: taskActions.getTaskProgressExecute,
				getTaskStatusCounts: taskActions.getTaskStatusCountsExecute,
				deleteTask: taskActions.deleteTaskExecute,
				getTaskByOrgunit: taskActions.getByOrgunitExecute,
			},
			user: {
				getById: userActions.getByIdExecute,
				findByLoginName: userActions.findByLoginNameExecute,
				findByGroup: userActions.findByGroupExecute,
				findByOrgunit: userActions.findByOrgunitExecute,
			},
		};

		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
