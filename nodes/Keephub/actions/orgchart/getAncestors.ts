import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Ancestors',
	name: 'getAncestors',
	action: 'Get all ancestors of an orgchart node',
	description: 'Retrieve all ancestors of an orgchart node up the hierarchy',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const nodeId = this.getNodeParameter('nodeId', index) as string;
		const depthLimit = this.getNodeParameter('depthLimit', index) as number;

		if (!nodeId) {
			throw new NodeOperationError(this.getNode(), 'Node ID is required', { itemIndex: index });
		}

		// Get the initial node
		const nodeData = (await apiRequest.call(this, 'GET', `/orgchart/${nodeId}`)) as IDataObject;

		const ancestors: Array<{ ancestorId: string; ancestorName: string }> = [];
		let currentParentId = nodeData.parent as string;
		let depth = 0;

		// Traverse up the hierarchy
		while (currentParentId && (depthLimit === 0 || depth < depthLimit)) {
			const parentData = (await apiRequest.call(
				this,
				'GET',
				`/orgchart/${currentParentId}`,
			)) as IDataObject;

			ancestors.push({
				ancestorId: parentData.id as string,
				ancestorName: parentData.name as string,
			});

			currentParentId = parentData.parent as string;
			depth++;
		}

		if (ancestors.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'Root node detected. Root nodes have no ancestors.',
				{ itemIndex: index },
			);
		}

		return [
			{
				json: {
					nodeId,
					ancestorsCount: ancestors.length,
					ancestors,
				},
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
