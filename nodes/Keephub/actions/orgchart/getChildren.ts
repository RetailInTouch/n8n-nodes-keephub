import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const nodeId = this.getNodeParameter('nodeId', index) as string;
	const additionalFields = this.getNodeParameter('additionalFields', index, {}) as IDataObject;
	const limit = (additionalFields.limit as number) || 50;

	if (!nodeId) {
		throw new NodeOperationError(this.getNode(), 'Node ID is required', { itemIndex: index });
	}

	const childrenResponse = (await apiRequest.call(
		this,
		'GET',
		`/orgchart?parent=${encodeURIComponent(nodeId)}`,
	)) as IDataObject | IDataObject[];

	const childNodes = Array.isArray(childrenResponse)
		? childrenResponse
		: (childrenResponse.data as IDataObject[]) || [];

	const children: Array<{ childId: string; childName: string }> = [];
	for (const child of childNodes) {
		if (limit > 0 && children.length >= limit) {
			break;
		}
		children.push({
			childId: child._id as string,
			childName: child.name as string,
		});
	}

	if (children.length === 0) {
		return [
			{
				json: {
					nodeId,
					childrenCount: 0,
					children: [],
					message: 'No children found for this node',
				},
				pairedItem: { item: index },
			},
		];
	}

	return [
		{
			json: {
				nodeId,
				childrenCount: children.length,
				children,
			},
			pairedItem: { item: index },
		},
	];
}
