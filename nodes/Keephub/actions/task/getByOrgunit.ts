import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgunitId = this.getNodeParameter('orgunitId', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	const limit = (options.limit as number) || 50;

	if (!orgunitId || orgunitId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Orgunit ID cannot be empty', {
			itemIndex: index,
		});
	}

	try {
		const skip = (options.skip as number) || 0;
		const sortBy = (options.sortBy as string) || '';
		const sortOrder = (options.sortOrder as number) || 1;
		const startDateGte = (options.startDateGte as string) || '';
		const startDateLte = (options.startDateLte as string) || '';

		let endpoint = `/tasktemplates?$limit=${limit}&$skip=${skip}&filterByNode[0]=${encodeURIComponent(orgunitId)}`;

		if (sortBy) {
			endpoint += `&$sort[${sortBy}]=${sortOrder}`;
		}

		// Convert dates to timestamps (milliseconds)
		if (startDateGte) {
			const gteTime = new Date(startDateGte).getTime();
			endpoint += `&dueDateGte=${gteTime}`;
		}

		if (startDateLte) {
			const lteTime = new Date(startDateLte).getTime();
			endpoint += `&dueDateLte=${lteTime}`;
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

		throw new NodeOperationError(this.getNode(), 'Error searching tasks by orgunit', {
			description: (error as Error).message,
			itemIndex: index,
		});
	}
}
