import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const groupId = this.getNodeParameter('groupId', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	const limit = (options.limit as number) || 50;

	if (!groupId || groupId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Group ID cannot be empty', {
			itemIndex: index,
		});
	}

	try {
		const skip = (options.skip as number) || 0;
		const sortBy = (options.sortBy as string) || '';
		const sortOrder = (options.sortOrder as number) || 1;

		let endpoint = `/contentsview?$limit=${limit}&$skip=${skip}&$and[0][groups.selection]=${encodeURIComponent(groupId)}`;

		if (sortBy) {
			endpoint += `&$sort[${sortBy}]=${sortOrder}`;
		}

		const response = (await apiRequest.call(this, 'GET', endpoint)) as IDataObject;

		let items: IDataObject[] = [];

		if (Array.isArray(response)) {
			items = response;
		} else if (response && response.data && Array.isArray(response.data)) {
			items = response.data as IDataObject[];
		}

		return items.map((dataItem: IDataObject) => ({
			json: dataItem,
			pairedItem: { item: index },
		}));
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}

		throw new NodeOperationError(this.getNode(), 'Error searching content by group', {
			description: (error as Error).message,
			itemIndex: index,
		});
	}
}
