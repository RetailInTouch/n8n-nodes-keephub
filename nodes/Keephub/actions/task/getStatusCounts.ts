import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Status Counts',
	name: 'getTaskStatusCounts',
	action: 'Get task template status counts',
	description: 'Get task template status counts',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', index) as string;

	if (!taskId || taskId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', {
			itemIndex: index,
		});
	}

	const response = (await apiRequest.call(
		this,
		'GET',
		// See getProgress.ts: without management=true the counts read below can
		// come back undefined, because progress is then an array of per-orgunit
		// entries with the numbers nested one level deeper.
		`/tasktemplates/${encodeURIComponent(taskId)}?management=true`,
	)) as IDataObject;

	const progressArray = (response.progress as IDataObject[]) || [];
	const progressData = progressArray[0] || {};

	return [
		{
			json: {
				done: progressData.done,
				open: progressData.open,
				approval: progressData.approval,
				status: progressData.status,
			},
			pairedItem: { item: index },
		},
	];
}
