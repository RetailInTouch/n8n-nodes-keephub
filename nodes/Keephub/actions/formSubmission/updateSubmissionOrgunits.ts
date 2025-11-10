import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, validateMongoId } from '../../utils/helpers';

export const description = {
	displayName: 'Update Form Submission Orgunit',
	name: 'updateSubmissionOrgunits',
	action: 'Update form submission orgunit',
	description: 'Update the organizational units of a form submission',
};

export async function execute(
	this: IExecuteFunctions,
	item: INodeExecutionData,
	index: number,
): Promise<INodeExecutionData[]> {
	try {
		const formSubmissionId = this.getNodeParameter('formSubmissionId', index) as string;
		const newOrgunitIds = this.getNodeParameter('newOrgunitId', index) as string;

		validateMongoId.call(this, formSubmissionId, 'Form Submission ID', index);

		const orgunitArray = newOrgunitIds
			.split(',')
			.map((id: string) => id.trim())
			.filter((id: string) => id.length > 0);

		if (orgunitArray.length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one Orgunit ID must be provided', {
				itemIndex: index,
			});
		}

		const formSubmission = (await apiRequest.call(
			this,
			'GET',
			`/formvalues/${formSubmissionId}`,
		)) as IDataObject;

		const contentRef =
			formSubmission.contentRef instanceof Object
				? (formSubmission.contentRef as IDataObject)._id
				: formSubmission.contentRef;

		const response = await apiRequest.call(this, 'PATCH', `/formvalues/${formSubmissionId}`, {
			contentRef,
			values: formSubmission.values,
			$set: {
				orgunitsOfCreator: orgunitArray,
			},
		});

		return [
			{
				json: {
					success: true,
					message: 'Updated orgunitsOfCreator',
					orgunitsOfCreator: orgunitArray,
				},
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
