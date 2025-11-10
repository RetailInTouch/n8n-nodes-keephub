import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Find by Login Name',
	name: 'findByLoginName',
	action: 'Find user by Login Name',
	description: 'Retrieve a user by their Login Name',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const loginName = this.getNodeParameter('loginName', index) as string;

		if (!loginName || loginName.trim().length === 0) {
			throw new NodeOperationError(this.getNode(), 'Login Name cannot be empty', {
				itemIndex: index,
			});
		}

		// Make API request
		const response = await apiRequest.call(
			this,
			'GET',
			`/users?loginName=${encodeURIComponent(loginName)}`,
		);

		// Return with pairedItem (required for n8n batch processing)
		return [
			{
				json: response as IDataObject,
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		// Error already thrown by apiRequest
		throw error;
	}
}
