import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, validateMongoId } from '../../utils/helpers';

export const description = {
	displayName: 'Get Submitter Details',
	name: 'getSubmitterDetails',
	action: 'Get submitter details',
	description: 'Retrieve details of the user who submitted a form',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const formSubmissionId = this.getNodeParameter('formSubmissionId', index) as string;

		validateMongoId.call(this, formSubmissionId, 'Form Submission ID', index);

		const formSubmission = (await apiRequest.call(
			this,
			'GET',
			`/formvalues/${formSubmissionId}`,
		)) as IDataObject;

		if (!formSubmission || !formSubmission.createdBy) {
			throw new NodeOperationError(this.getNode(), 'Form submission or submitter not found', {
				itemIndex: index,
			});
		}

		const submitterId =
			typeof formSubmission.createdBy === 'string'
				? (formSubmission.createdBy as string)
				: (formSubmission.createdBy as IDataObject)._id;

		const submitterData = await apiRequest.call(this, 'GET', `/users/${submitterId}`);

		return [
			{
				json: submitterData as IDataObject,
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
