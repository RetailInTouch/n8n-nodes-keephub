import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Approve Content',
	name: 'approveContent',
	action: 'Approve content',
	description: 'Approve content pending approval',
};

export async function execute(
	this: IExecuteFunctions,
	_item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const contentId = this.getNodeParameter('contentId', index) as string;
	const contentType = this.getNodeParameter('approvalContentType', index) as string;

	if (!contentId || contentId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Content ID cannot be empty', {
			itemIndex: index,
		});
	}

	if (!contentType || contentType.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Content type cannot be empty', {
			itemIndex: index,
		});
	}

	const response = await apiRequest.call(this, 'POST', '/workflow', {
		action: 'approveContent',
		contentType,
		ref: contentId,
	});

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
