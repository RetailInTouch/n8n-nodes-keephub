export const formSubmissionFields = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['formSubmission'] } },
		options: [
			{ name: 'Get', value: 'getFormSubmission', description: 'Fetch full form submission data' },
			{
				name: 'Get Submitter Details',
				value: 'getSubmitterDetails',
				description: 'Fetch full user data of the submitter',
			},
			{
				name: 'Get Submission Orgunits',
				value: 'getSubmissionOrgunits',
				description: 'Fetch orgunit hierarchy',
			},
			{
				name: 'Update Submission Orgunits',
				value: 'updateSubmissionOrgunits',
				description: 'Change submission orgunit to limit visibility',
			},
			{
				name: 'Calculate Response Duration',
				value: 'calculateResponseDuration',
				description: 'Time from form creation to submission',
			},
		],
		default: 'getFormSubmission',
	},
	{
		displayName: 'Form Submission ID',
		name: 'formSubmissionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['formSubmission'],
				operation: [
					'getFormSubmission',
					'getSubmitterDetails',
					'getSubmissionOrgunits',
					'updateSubmissionOrgunits',
					'calculateResponseDuration',
				],
			},
		},
		default: '',
		placeholder: '63bd885034d0466d11073575',
		description: 'The ID of the form submission',
		required: true,
	},
	{
		displayName: 'New Orgunit ID(s)',
		name: 'newOrgunitId',
		type: 'string',
		displayOptions: {
			show: { resource: ['formSubmission'], operation: ['updateSubmissionOrgunits'] },
		},
		default: '',
		placeholder: 'root0001, test0001, root0067',
		description: 'Orgunit ID(s) to assign (comma-separated for multiple)',
		required: true,
	},
];
