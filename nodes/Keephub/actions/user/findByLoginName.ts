import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Find by Login Name',
	name: 'findByLoginName',
	action: 'Find user by Login Name',
	description: 'Retrieve a user by their Login Name',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const loginName = this.getNodeParameter('loginName', index) as string;

	if (!loginName || loginName.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Login Name cannot be empty', {
			itemIndex: index,
		});
	}

	const response = await apiRequest.call(
		this,
		'GET',
		`/users?loginName=${encodeURIComponent(loginName)}`,
	);

	let results: IDataObject[];
	if (Array.isArray(response)) {
		results = response as IDataObject[];
	} else if (response && Array.isArray((response as IDataObject).data)) {
		results = ((response as IDataObject).data) as IDataObject[];
	} else {
		results = [response as IDataObject];
	}

	return results.map((entry: IDataObject) => ({
		json: entry,
		pairedItem: { item: index },
	}));
}
