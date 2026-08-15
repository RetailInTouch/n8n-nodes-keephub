import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Progress',
	name: 'getTaskProgress',
	action: 'Get task template progress',
	description: 'Get task template progress',
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
		// management=true returns the aggregated progress entry this operation
		// reads (done/open/approval/orgunits). Without it the API can answer with
		// per-orgunit entries whose counts sit under directTaskStatusCount and
		// zoiTaskStatusCount instead, and every field below comes back undefined.
		`/tasktemplates/${encodeURIComponent(taskId)}?management=true`,
	)) as IDataObject;

	const progressArray = (response.progress as IDataObject[]) || [];
	const progressData = progressArray[0] || {};
	delete progressData.orgunits;

	return [
		{
			json: {
				id: response._id,
				fullProgress: [progressData],
			},
			pairedItem: { item: index },
		},
	];
}
