import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Find by Orgunit',
	name: 'findByOrgunit',
	action: 'Find users by orgunit',
	description: 'Find all users in a specific organization unit',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const orgunitId = this.getNodeParameter('orgunitId', index) as string;

		if (!orgunitId || orgunitId.trim().length === 0) {
			throw new NodeOperationError(this.getNode(), 'Orgunit ID cannot be empty', {
				itemIndex: index,
			});
		}

		// Make API request
		const response = await apiRequest.call(
			this,
			'GET',
			`/users?orgunits=${encodeURIComponent(orgunitId)}`,
		);

		// Handle both array and single object responses
		const items = Array.isArray(response) ? response : [response];

		// Return all items with pairedItem
		return items.map((item: IDataObject) => ({
			json: item,
			pairedItem: { item: index },
		}));
	} catch (error) {
		// Error already thrown by apiRequest
		throw error;
	}
}
