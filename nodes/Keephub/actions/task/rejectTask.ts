import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Reject Task',
	name: 'rejectTask',
	action: 'Reject a task',
	description: 'Reject a pending task with a reason',
};

export async function execute(
	this: IExecuteFunctions,
	_item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', index) as string;
	const rejectionReason = this.getNodeParameter('rejectionReason', index) as string;

	if (!taskId || taskId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', {
			itemIndex: index,
		});
	}

	if (!rejectionReason || rejectionReason.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Rejection reason cannot be empty', {
			itemIndex: index,
		});
	}

	const response = await apiRequest.call(this, 'POST', '/workflow', {
		action: 'rejectTaskAnswer',
		ref: taskId,
		value: rejectionReason,
	});

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
