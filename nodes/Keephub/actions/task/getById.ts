import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Task Template by ID',
	name: 'getTask',
	action: 'Get a task template by ID',
	description: 'Get a task template by its ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	if (!taskId || taskId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', {
			itemIndex: index,
		});
	}

	// Opt-in, because it changes the response: management=true adds
	// lastReminderAt and canEdit, and returns progress as a single aggregated
	// entry rather than one entry per orgunit.
	const management = options.management === true ? '?management=true' : '';

	const response = await apiRequest.call(
		this,
		'GET',
		`/tasktemplates/${encodeURIComponent(taskId)}${management}`,
	);

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
