import type { INodeExecutionData, IDataObject } from 'n8n-workflow';
import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest, validateMongoId } from '../../utils/helpers';

export const description = {
	displayName: 'Get Orgunit Context',
	name: 'getSubmissionOrgunits',
	action: 'Get orgunit context',
	description: 'Retrieve organizational units context of the form submitter',
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
			throw new NodeOperationError(
				this.getNode(),
				'Form submission or submitter not found',
				{ itemIndex: index },
			);
		}

		const submitterId =
			typeof formSubmission.createdBy === 'string'
				? (formSubmission.createdBy as string)
				: (formSubmission.createdBy as IDataObject)._id;

		const submitterData = (await apiRequest.call(
			this,
			'GET',
			`/users/${submitterId}`,
		)) as IDataObject;

		// Fetch each orgunit details
		const orgunitDetails: IDataObject[] = [];

		for (const orgunitId of (submitterData.orgunits as string[]) || []) {
			try {
				const orgunitData = (await apiRequest.call(
					this,
					'GET',
					`/orgchart/${orgunitId}`,
				)) as IDataObject;

				orgunitDetails.push({
					id: orgunitId,
					name: orgunitData.name || 'Unknown',
					path: ((orgunitData.namepath as string) || '').slice(1),
				});
			} catch (err) {
				// Skip if orgunit fetch fails
				orgunitDetails.push({
					id: orgunitId,
					name: 'Error fetching',
					path: '',
				});
			}
		}

		return [
			{
				json: {
					_id: submitterData._id,
					name: submitterData.name,
					orgunits: orgunitDetails,
				},
				pairedItem: { item: index },
			},
		];
	} catch (error) {
		throw error;
	}
}
