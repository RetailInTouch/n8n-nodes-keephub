import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get by ID',
	name: 'getById',
	action: 'Get an orgchart node',
	description: 'Retrieve a single orgchart node by ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const nodeId = this.getNodeParameter('nodeId', index) as string;

	if (!nodeId) {
		throw new NodeOperationError(this.getNode(), 'Node ID is required', { itemIndex: index });
	}

	const response = (await apiRequest.call(this, 'GET', `/orgchart/${encodeURIComponent(nodeId)}`)) as IDataObject;

	return [
		{
			json: response,
			pairedItem: { item: index },
		},
	];
}
