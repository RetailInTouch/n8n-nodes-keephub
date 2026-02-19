import type { INodeExecutionData, IDataObject, IExecuteFunctions  } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Delete',
	name: 'delete',
	action: 'Delete content',
	description: 'Delete content by ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const contentId = this.getNodeParameter('contentId', index) as string;

	if (!contentId || contentId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Content ID cannot be empty', {
			itemIndex: index,
		});
	}

	const response = await apiRequest.call(
		this,
		'DELETE',
		`/contents/${encodeURIComponent(contentId)}`,
	);

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
