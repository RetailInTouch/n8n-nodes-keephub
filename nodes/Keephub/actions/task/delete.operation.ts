import type { INodeExecutionData } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Delete',
	name: 'deleteTask',
	action: 'Delete task template',
	description: 'Delete a task template',
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

		// Delete template
		const response1 = await apiRequest.call(
			this,
			'DELETE',
			`/tasktemplates/${encodeURIComponent(taskId)}`,
		);

		// Delete instances
		const response2 = await apiRequest.call(
			this,
			'DELETE',
			`/tasktemplates/${encodeURIComponent(taskId)}/instance`,
		);

		return [
			{
				json: {
					templateDeleted: response1,
					instanceDeleted: response2,
				},
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
