import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Find by Group',
	name: 'findByGroup',
	action: 'Find users by group',
	description: 'Find all users in a specific group',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;

	if (!groupId || groupId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Group ID cannot be empty', {
			itemIndex: index,
		});
	}

	const response = await apiRequest.call(
		this,
		'GET',
		`/users?groups=${encodeURIComponent(groupId)}`,
	);

	const results = Array.isArray(response) ? response : [response];

	return results.map((entry: IDataObject) => ({
		json: entry,
		pairedItem: { item: index },
	}));
}
