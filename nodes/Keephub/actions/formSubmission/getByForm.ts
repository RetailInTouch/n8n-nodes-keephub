import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, validateMongoId } from '../../utils/helpers';

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const contentRef = this.getNodeParameter('contentRef', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;

	validateMongoId.call(this, contentRef, 'Form Content ID', index);

	const limit = (options.limit as number) || 50;
	const skip = (options.skip as number) || 0;
	const sortBy = (options.sortBy as string) || 'updatedAt';
	const sortOrder = (options.sortOrder as number) ?? -1;

	try {
		const endpoint =
			`/formvalues?$limit=${limit}&$skip=${skip}` +
			`&$sort[${encodeURIComponent(sortBy)}]=${sortOrder}` +
			`&$sort[_id]=1` +
			`&contentType=form&widgetId=formValues` +
			`&contentRef=${encodeURIComponent(contentRef)}`;

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

		throw new NodeOperationError(this.getNode(), 'Error fetching form submissions by form', {
			description: (error as Error).message,
			itemIndex: index,
		});
	}
}
