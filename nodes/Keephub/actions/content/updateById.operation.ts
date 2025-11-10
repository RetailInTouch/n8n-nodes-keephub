import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
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

	console.log('=== UPDATE BY ID OPERATION START ===');
	console.log('Content ID:', contentId);
	console.log('Update Data Raw:', JSON.stringify(updateDataRaw, null, 2));

	if (!contentId || contentId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Content ID cannot be empty', {
			itemIndex: index,
		});
	}

	try {
		// Get all fields for this content
		console.log('Fetching content from API...');
		const currentContent = (await apiRequest.call(
			this,
			'GET',
			`/contents/${encodeURIComponent(contentId)}`,
		)) as IDataObject;

		console.log('Current content fetched:', JSON.stringify(currentContent, null, 2));

		// Extract assignments from the update data
		// Extract assignments from the update data
		const assignments = (updateDataRaw?.assignments as Array<Record<string, unknown>>) || [];

		console.log('Assignments extracted:', JSON.stringify(assignments, null, 2));

		if (assignments.length === 0) {
			console.log('NO ASSIGNMENTS FOUND - This is the problem!');
			throw new NodeOperationError(this.getNode(), 'No fields to update', {
				itemIndex: index,
			});
		}

		// Build updates from assignments
		console.log('Processing assignments...');
		for (const assignment of assignments) {
			let name = assignment.name as string;
			const value = assignment.value as unknown;

			// STRIP THE [0].json PREFIX IF IT EXISTS (this is what was working before)
			if (name.startsWith('[0].json.')) {
				name = name.substring(9); // Remove '[0].json.' (9 characters)
				console.log(`Stripped path from [0].json.${name} to ${name}`);
			}

			console.log(`Setting field: ${name} = ${JSON.stringify(value)}`);

			if (name && name.trim().length > 0) {
				setNestedValue(currentContent, name, value);
			}
		}

		console.log('Final content to send:', JSON.stringify(currentContent, null, 2));

		// Send the complete updated object
		console.log('Sending PATCH request...');
		const response = await apiRequest.call(
			this,
			'PATCH',
			`/contents/${encodeURIComponent(contentId)}`,
			currentContent,
		);

		console.log('API Response:', JSON.stringify(response, null, 2));
		console.log('=== UPDATE BY ID OPERATION SUCCESS ===');

		return [
			{
				json: response as IDataObject,
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		console.log('=== ERROR IN UPDATE BY ID ===');
		console.log('Error:', error);
		throw error;
	}
}
