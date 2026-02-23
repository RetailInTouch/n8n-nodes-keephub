import type { INodeExecutionData, IDataObject, IExecuteFunctions, JsonObject } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Get Task Template by Task',
	name: 'getTemplateByTask',
	action: 'Get the task template for a given task',
	description: 'Fetch the task template that a specific task was created from, using the task ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskInstanceId', index) as string;

	if (!taskId || taskId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', { itemIndex: index });
	}

	// Step 1: fetch the task instance to get its templateRef
	const task = (await apiRequest.call(
		this,
		'GET',
		`/tasks/${encodeURIComponent(taskId)}`,
	)) as IDataObject;

	const templateRef = task.templateRef as string;

	if (!templateRef) {
		throw new NodeApiError(this.getNode(), task as unknown as JsonObject, {
			message: `Task "${taskId}" does not have a templateRef field in the response`,
			description: 'Ensure the task ID is correct and the task belongs to a template.',
		});
	}

	// Step 2: fetch and return the task template
	const template = await apiRequest.call(
		this,
		'GET',
		`/tasktemplates/${encodeURIComponent(templateRef)}`,
	);

	return [
		{
			json: template as IDataObject,
			pairedItem: { item: index },
		},
	];
}
