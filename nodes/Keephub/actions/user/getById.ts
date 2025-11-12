import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
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
	const userId = this.getNodeParameter('userId', index) as string;

	validateMongoId.call(this, userId, 'User ID', index);

	const response = await apiRequest.call(this, 'GET', `/users/${userId}`);

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
