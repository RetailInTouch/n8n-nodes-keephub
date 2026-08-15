import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
	displayName: 'Send Task Reminder',
	name: 'sendTaskReminder',
	action: 'Send a reminder for a task template',
	description: 'Send a reminder to everyone who still has this task template open',
};

export async function execute(
	this: IExecuteFunctions,
	_item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const taskId = this.getNodeParameter('taskId', index) as string;
	const options = this.getNodeParameter('options', index, {}) as IDataObject;
	const verify = options.verify !== false;

	if (!taskId || taskId.trim().length === 0) {
		throw new NodeOperationError(this.getNode(), 'Task ID cannot be empty', {
			itemIndex: index,
		});
	}

	const id = encodeURIComponent(taskId.trim());

	// The id and the action are repeated in the body, matching the call the
	// Keephub UI makes. `action` is a PUT query parameter alongside the
	// documented pause/resume/complete/restart values.
	const response = (await apiRequest.call(
		this,
		'PUT',
		`/tasktemplates/${id}?_id=${id}&action=reminder`,
		{ _id: taskId.trim(), action: 'reminder' },
	)) as IDataObject;

	const result: IDataObject = {
		_id: (response._id as string) || taskId.trim(),
		reminderSent: true,
		status: response.status ?? null,
		lastTaskUserCount: response.lastTaskUserCount ?? null,
	};

	if (!verify) {
		return [{ json: result, pairedItem: { item: index } }];
	}

	// The reminder response does not carry lastReminderAt; only the management
	// view does. Read it back so a reminder that did not land is visible instead
	// of being reported as success.
	try {
		const readBack = (await apiRequest.call(
			this,
			'GET',
			`/tasktemplates/${id}?management=true`,
		)) as IDataObject;

		const lastReminderAt = (readBack.lastReminderAt as string) || null;

		result.verified = Boolean(lastReminderAt);
		result.lastReminderAt = lastReminderAt;
		result.status = readBack.status ?? result.status;
		result.lastTaskUserCount = readBack.lastTaskUserCount ?? result.lastTaskUserCount;
	} catch (error) {
		// The reminder itself succeeded; only the confirmation read failed.
		result.verified = false;
		result.verifyError = error instanceof Error ? error.message : 'Unknown error';
	}

	return [{ json: result, pairedItem: { item: index } }];
}
