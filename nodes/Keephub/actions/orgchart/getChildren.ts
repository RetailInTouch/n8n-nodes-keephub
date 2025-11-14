import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const nodeId = this.getNodeParameter('nodeId', index) as string;
	const limit = this.getNodeParameter('limit', index) as number;

	if (!nodeId) {
		throw new NodeOperationError(this.getNode(), 'Node ID is required', { itemIndex: index });
	}

	const children: Array<{ childId: string; childName: string }> = [];
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const executeFunctions = this;

	async function traverseChildren(parentId: string): Promise<void> {
		if (limit > 0 && children.length >= limit) {
			return;
		}

		const childrenResponse = (await apiRequest.call(
			executeFunctions,
			'GET',
			`/orgchart?parent=${encodeURIComponent(parentId)}`,
		)) as IDataObject | IDataObject[];

		const childNodes = Array.isArray(childrenResponse)
			? childrenResponse
			: (childrenResponse.data as IDataObject[]) || [];

		// Add direct children
		for (const child of childNodes) {
			if (limit > 0 && children.length >= limit) {
				break;
			}

			children.push({
				childId: child._id as string,
				childName: child.name as string,
			});
		}
	}

	await traverseChildren(nodeId);

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
