import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Update by ID',
	name: 'updateById',
	action: 'Update content by ID',
	description: 'Update content by ID',
};

function setNestedValue(obj: IDataObject, path: string, value: unknown): void {
	const keys = path.split('.');
	let current = obj;

	for (let i = 0; i < keys.length - 1; i++) {
		const key = keys[i];
		if (!current[key] || typeof current[key] !== 'object') {
			current[key] = {};
		}
		current = current[key] as IDataObject;
	}

	current[keys[keys.length - 1]] = value as IDataObject[string];
}

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const contentId = this.getNodeParameter('contentId', index) as string;
	const updateDataRaw = this.getNodeParameter('updateFields', index) as Record<string, unknown>;

	if (!contentId || contentId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Content ID cannot be empty', {
			itemIndex: index,
		});
	}

	const currentContent = (await apiRequest.call(
		this,
		'GET',
		`/contents/${encodeURIComponent(contentId)}`,
	)) as IDataObject;

	const assignments = (updateDataRaw?.assignments as Array<Record<string, unknown>>) || [];
	if (assignments.length === 0) {
		throw new NodeOperationError(this.getNode(), 'No fields to update', {
			itemIndex: index,
		});
	}

	// Build updates from assignments
	for (const assignment of assignments) {
		let name = assignment.name as string;
		const value = assignment.value as unknown;

		// STRIP THE [0].json PREFIX IF IT EXISTS (this is what was working before)
		if (name.startsWith('[0].json.')) {
			name = name.substring(9); // Remove '[0].json.' (9 characters)
		}

		if (name && name.trim().length > 0) {
			setNestedValue(currentContent, name, value);
		}
	}

	// Send the complete updated object
	const response = await apiRequest.call(
		this,
		'PATCH',
		`/contents/${encodeURIComponent(contentId)}`,
		currentContent,
	);

	return [
		{
			json: response as IDataObject,
			pairedItem: { item: index },
		},
	];
}
