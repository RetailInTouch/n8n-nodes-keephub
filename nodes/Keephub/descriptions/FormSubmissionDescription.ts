import type { INodeProperties } from 'n8n-workflow';

export const formSubmissionFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['formSubmission'] } },
		options: [
			{
				name: 'Calculate Response Duration',
				value: 'calculateResponseDuration',
				description: 'Time from form creation to submission',
				action: 'Calculate response duration for a form submission',
			},
			{
				name: 'Find by Form',
				value: 'findByForm',
				description: 'Retrieve all submissions for a given form',
				action: 'Find form submissions by form',
			},
			{
				name: 'Get',
				value: 'getFormSubmission',
				description: 'Fetch full form submission data',
				action: 'Get a form submission',
			},
			{
				name: 'Get Submission Orgunits',
				value: 'getSubmissionOrgunits',
				description: 'Fetch orgunit hierarchy',
				action: 'Get submission orgunits for a form submission',
			},
			{
				name: 'Get Submitter Details',
				value: 'getSubmitterDetails',
				description: 'Fetch full user data of the submitter',
				action: 'Get submitter details for a form submission',
			},
			{
				name: 'Update Submission Orgunits',
				value: 'updateSubmissionOrgunits',
				description: 'Change submission orgunit to limit visibility',
				action: 'Update submission orgunits for a form submission',
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
	{
		displayName: 'Form Content ID',
		name: 'contentRef',
		type: 'string',
		displayOptions: {
			show: { resource: ['formSubmission'], operation: ['findByForm'] },
		},
		default: '',
		placeholder: '699848533ab62d9d50409890',
		description:
			'The content ID of the form whose submissions you want to retrieve (24-character MongoDB ObjectID)',
		required: true,
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		displayOptions: {
			show: { resource: ['formSubmission'], operation: ['findByForm'] },
		},
		default: {},
		placeholder: 'Add option',
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: { minValue: 1 },
				default: 50,
				description: 'Max number of results to return',
			},
			{
				displayName: 'Skip',
				name: 'skip',
				type: 'number',
				default: 0,
				description: 'Number of results to skip (pagination)',
			},
			{
				displayName: 'Sort Field',
				name: 'sortBy',
				type: 'string',
				default: 'updatedAt',
				placeholder: 'updatedAt',
				description: 'Field to sort by (e.g. updatedAt, createdAt)',
			},
			{
				displayName: 'Sort Order',
				name: 'sortOrder',
				type: 'options',
				options: [
					{ name: 'Ascending', value: 1 },
					{ name: 'Descending', value: -1 },
				],
				default: -1,
				description: 'Sort direction (-1 = newest first)',
			},
		],
	},
];
