import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
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
	try {
		const nodeId = this.getNodeParameter('nodeId', index) as string;

		if (!nodeId) {
			throw new NodeOperationError(this.getNode(), 'Node ID is required', { itemIndex: index });
		}

		const response = (await apiRequest.call(this, 'GET', `/orgchart/${nodeId}`)) as IDataObject;

		return [
			{
				json: response,
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
