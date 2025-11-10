import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, parseJsonParameter } from '../../utils/helpers';

export const description = {
	displayName: 'Create',
	name: 'create',
	action: 'Create content',
	description: 'Create new content',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const contentBody = this.getNodeParameter('contentBody', index) as unknown;

		const body = parseJsonParameter.call(this, contentBody, 'Content Body', index);

	
		if (!body || Object.keys(body).length === 0) {
			throw new NodeOperationError(this.getNode(), 'Content body cannot be empty', {
				itemIndex: index,
			});
		}

		const response = await apiRequest.call(this, 'POST', '/contents', body);

		return [
			{
				json: response as IDataObject,
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}