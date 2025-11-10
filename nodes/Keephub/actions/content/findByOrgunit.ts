import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Find by Orgunit',
	name: 'findByOrgunit',
	action: 'Find contents by organization unit',
	description: 'Find contents by organization unit',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const orgunitId = this.getNodeParameter('orgunitId', index) as string;
		const limit = this.getNodeParameter('limit', index, 50) as number;

		if (!orgunitId || orgunitId.trim().length === 0) {
			throw new NodeOperationError(this.getNode(), 'Orgunit ID cannot be empty', {
				itemIndex: index,
			});
		}

		const params = new URLSearchParams();
		params.append('orgunitId', orgunitId);
		if (limit) {
			params.append('limit', limit.toString());
		}

		const response = await apiRequest.call(this, 'GET', `/contents?${params.toString()}`);

		const items = Array.isArray(response) ? response : [response];

		return items.map((item: IDataObject) => ({
			json: item,
			pairedItem: { item: index },
		}));
	} catch (error) {
		throw error;
	}
}
