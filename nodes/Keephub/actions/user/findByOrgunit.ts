import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Find by Orgunit',
	name: 'findByOrgunit',
	action: 'Find users by orgunit',
	description: 'Find all users in a specific organization unit',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const orgunitId = this.getNodeParameter('orgunitId', index) as string;

	if (!orgunitId || orgunitId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Orgunit ID cannot be empty', {
			itemIndex: index,
		});
	}

	const response = (await apiRequest.call(
		this,
		'GET',
		`/users?orgunits=${encodeURIComponent(orgunitId)}`,
	)) as IDataObject;

	let results: IDataObject[];
	if (Array.isArray(response)) {
		results = response as IDataObject[];
	} else if (response && Array.isArray(response.data)) {
		results = response.data as IDataObject[];
	} else {
		results = [];
	}

	return results.map((entry) => ({
		json: entry,
		pairedItem: { item: index },
	}));
}
