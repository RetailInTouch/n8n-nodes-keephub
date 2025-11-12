import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, validateMongoId } from '../../utils/helpers';

export const description = {
	displayName: 'Calculate Response Duration',
	name: 'calculateResponseDuration',
	action: 'Calculate response duration',
	description: 'Calculate the time taken to submit a form',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	const formSubmissionId = this.getNodeParameter('formSubmissionId', index) as string;

	validateMongoId.call(this, formSubmissionId, 'Form Submission ID', index);

	// Get form submission first to extract contentRef ID
	const formSubmission = (await apiRequest.call(
		this,
		'GET',
		`/formvalues/${formSubmissionId}`,
	)) as IDataObject;

	if (!formSubmission || !formSubmission.contentRef) {
		throw new NodeOperationError(this.getNode(), 'Form submission or contentRef not found', {
			itemIndex: index,
		});
	}

	const contentId =
		formSubmission.contentRef instanceof Object
			? (formSubmission.contentRef as IDataObject)._id
			: formSubmission.contentRef;

	// Now fetch the form/content to get creation time
	const contentRef = (await apiRequest.call(this, 'GET', `/contents/${contentId}`)) as IDataObject;

	const createdAt = new Date(contentRef.createdAt as string).getTime();
	const submittedAt = new Date(formSubmission.createdAt as string).getTime();

	const durationMs = submittedAt - createdAt;
	const durationSecs = Math.floor(durationMs / 1000);
	const durationMins = Math.floor(durationSecs / 60);
	const durationHours = Math.floor(durationMins / 60);
	const durationDays = Math.floor(durationHours / 24);

	const remainingSecs = durationSecs % 60;
	const remainingMins = durationMins % 60;
	const remainingHours = durationHours % 24;

	return [
		{
			json: {
				formId: contentId,
				formCreatedAt: contentRef.createdAt,
				submittedAt: formSubmission.createdAt,
				duration: {
					timeSinceFormCreated: `${durationDays}d ${remainingHours}h ${remainingMins}m ${remainingSecs}s`,
				},
			},
			pairedItem: { item: index },
		},
	];
}
