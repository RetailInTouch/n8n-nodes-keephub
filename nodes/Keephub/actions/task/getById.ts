import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get by ID',
	name: 'getTask',
	action: 'Get task template by ID',
	description: 'Get a task template by its ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const taskId = this.getNodeParameter('taskId', index) as string;

		if (!taskId || taskId.trim().length === 0) {
			throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', {
				itemIndex: index,
			});
		}

		const response = await apiRequest.call(
			this,
			'GET',
			`/tasktemplates/${encodeURIComponent(taskId)}`,
		);

		return [
			{
				json: response as IDataObject,
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}

