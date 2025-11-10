import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Children',
	name: 'getChildren',
	action: 'Get all children of an orgchart node',
	description: 'Retrieve all children/descendants of an orgchart node',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const nodeId = this.getNodeParameter('nodeId', index) as string;
		const depthLimit = this.getNodeParameter('depthLimit', index) as number;
		const limit = this.getNodeParameter('limit', index) as number;

		if (!nodeId) {
			throw new NodeOperationError(this.getNode(), 'Node ID is required', { itemIndex: index });
		}

		const children: Array<{ childId: string; childName: string }> = [];
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const executeFunctions = this;

		async function traverseChildren(parentId: string, currentDepth: number): Promise<void> {
			// Stop if we've reached the depth limit (depthLimit = 0 means unlimited)
			if (depthLimit > 0 && currentDepth >= depthLimit) {
				return;
			}

			// Stop if we've reached the result limit (limit = 0 means unlimited)
			if (limit > 0 && children.length >= limit) {
				return;
			}

			// Query for children using parent filter
			const childrenResponse = (await apiRequest.call(
				executeFunctions,
				'GET',
				`/orgchart?parent=${parentId}`,
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
					childId: child.id as string,
					childName: child.name as string,
				});

				// Recursively get descendants
				await traverseChildren(child.id as string, currentDepth + 1);
			}
		}

		await traverseChildren(nodeId, 0);

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
	} catch (error) {
		throw error;
	}
}
