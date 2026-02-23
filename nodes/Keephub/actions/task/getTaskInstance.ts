import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Task',
	name: 'getTaskInstance',
	action: 'Get a task by ID',
	description: 'Fetch a task instance by its ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskInstanceId', index) as string;

	if (!taskId || taskId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', { itemIndex: index });
	}

	const response = await apiRequest.call(this, 'GET', `/tasks/${encodeURIComponent(taskId)}`);

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
