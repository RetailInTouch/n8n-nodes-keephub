import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, validateMongoId } from '../../utils/helpers';

export const description = {
	displayName: 'Get by ID',
	name: 'getById',
	action: 'Get user by ID',
	description: 'Retrieve a user by their unique ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const userId = this.getNodeParameter('userId', index) as string;

		// Validate MongoDB ID format
		validateMongoId.call(this, userId, 'User ID', index);

		// Make API request
		const response = await apiRequest.call(this, 'GET', `/users/${userId}`);

		// Return with pairedItem (required for n8n batch processing)
		return [
			{
				json: response as IDataObject,
				pairedItem: { item: index },
			},
		];
	} catch (_error) {
		// Error already thrown by apiRequest or validateMongoId
		throw _error;
	}
}
