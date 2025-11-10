import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Find by Group',
	name: 'findByGroup',
	action: 'Find contents by group',
	description: 'Find contents by group',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const groupId = this.getNodeParameter('groupId', index) as string;
		const limit = this.getNodeParameter('limit', index, 50) as number;

		if (!groupId || groupId.trim().length === 0) {
			throw new NodeOperationError(this.getNode(), 'Group ID cannot be empty', {
				itemIndex: index,
			});
		}

		const params = new URLSearchParams();
		params.append('groupId', groupId);
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
