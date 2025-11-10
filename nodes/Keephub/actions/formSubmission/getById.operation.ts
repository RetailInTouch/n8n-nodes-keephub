import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, validateMongoId } from '../../utils/helpers';

export const description = {
	displayName: 'Get Form Submission',
	name: 'getFormSubmission',
	action: 'Get a form submission',
	description: 'Retrieve a specific form submission by ID',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const formSubmissionId = this.getNodeParameter('formSubmissionId', index) as string;

		validateMongoId.call(this, formSubmissionId, 'Form Submission ID', index);

		const response = await apiRequest.call(this, 'GET', `/formvalues/${formSubmissionId}`);

		if (!response) {
			throw new NodeOperationError(
				this.getNode(),
				`Form submission not found: ${formSubmissionId}`,
				{ itemIndex: index },
			);
		}

		return [
			{
				json: response as IDataObject,
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
