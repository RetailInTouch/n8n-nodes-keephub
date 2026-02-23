import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Approve Task',
	name: 'approveTask',
	action: 'Approve a task',
	description: 'Approve a pending task',
};

export async function execute(
	this: IExecuteFunctions,
	_item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', index) as string;
	const approvalComment = this.getNodeParameter('approvalComment', index, '') as string;

	if (!taskId || taskId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', {
			itemIndex: index,
		});
	}

	const response = await apiRequest.call(this, 'POST', '/workflow', {
		action: 'approveTaskAnswer',
		ref: taskId,
		value: approvalComment,
	});

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
