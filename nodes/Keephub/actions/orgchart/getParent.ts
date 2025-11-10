import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Parent',
	name: 'getParent',
	action: 'Get parent of an orgchart node',
	description: 'Retrieve the parent node of an orgchart node',
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

		// Get the node to access its parent information
		const nodeData = (await apiRequest.call(this, 'GET', `/orgchart/${nodeId}`)) as IDataObject;

		const parentId = nodeData.parent as string;

		if (!parentId) {
			throw new NodeOperationError(
				this.getNode(),
				'Root node detected. Root nodes have no ancestors.',
				{ itemIndex: index },
			);
		}

		// Fetch parent node details
		const parentData = (await apiRequest.call(this, 'GET', `/orgchart/${parentId}`)) as IDataObject;

		return [
			{
				json: {
					parentId: parentData.id,
					parentName: parentData.name,
					parent: parentData,
				},
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
