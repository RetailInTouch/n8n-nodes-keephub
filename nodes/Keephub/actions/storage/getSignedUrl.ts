import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Signed URL',
	name: 'getSignedUrl',
	action: 'Get a signed URL for a stored file',
	description: 'Generate a pre-signed URL for secure access to a file stored in Keephub',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const origin = this.getNodeParameter('origin', index) as string;
	const originId = this.getNodeParameter('originId', index) as string;
	const storageId = this.getNodeParameter('storageId', index) as string;
	const attachment = this.getNodeParameter('attachment', index, false) as boolean;

	if (!origin || origin.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Origin cannot be empty', { itemIndex: index });
	}

	if (!originId || originId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Origin ID cannot be empty', {
			itemIndex: index,
		});
	}

	if (!storageId || storageId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Storage ID cannot be empty', {
			itemIndex: index,
		});
	}

	const body: IDataObject = {
		signType: 'getObject',
		origin,
		originId,
		storageId,
	};

	if (attachment) {
		body.attachment = true;
	}

	const response = await apiRequest.call(this, 'POST', '/signurl', body);

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
