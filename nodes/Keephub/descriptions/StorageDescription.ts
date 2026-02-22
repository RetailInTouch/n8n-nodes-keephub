import type { INodeProperties } from 'n8n-workflow';

export const storageFields: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['storage'] } },
		options: [
			{
				name: 'Get Signed URL',
				value: 'getSignedUrl',
				description: 'Generate a pre-signed URL for secure access to a stored file',
				action: 'Get a signed URL for a stored file',
			},
		],
		default: 'getSignedUrl',
	},

	// ── Origin ──────────────────────────────────────────────────────────────
	{
		displayName: 'Origin',
		name: 'origin',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['storage'], operation: ['getSignedUrl'] } },
		options: [
			{ name: 'Content Attachment', value: 'contentAttachment' },
			{ name: 'Content Template Attachment', value: 'contentTemplateAttachment' },
			{ name: 'Content Video', value: 'contentVideo' },
			{ name: 'External Attachment', value: 'externalAttachment' },
			{ name: 'Form Values Attachment', value: 'formValuesAttachment' },
			{ name: 'Form Values Video', value: 'formValuesVideo' },
			{ name: 'Lesson Attachment', value: 'lessonAttachment' },
			{ name: 'Task Attachment', value: 'taskAttachment' },
			{ name: 'Task Form Answer', value: 'taskFormAnswer' },
			{ name: 'Tasktemplate Attachment', value: 'tasktemplateAttachment' },
			{ name: 'Tasktemplate Video', value: 'tasktemplateVideo' },
		],
		default: 'taskFormAnswer',
		description: 'The origin type of the file. Determines which entity is used for access verification.',
	},

	// ── Origin ID ────────────────────────────────────────────────────────────
	{
		displayName: 'Origin ID',
		name: 'originId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['storage'], operation: ['getSignedUrl'] } },
		default: '',
		description:
			'ID of the entity that owns the file (task, content, form, etc.). Use the _id field from a preceding Keephub node output.',
		placeholder: 'e.g. 699974e8f6c386b2e3e93cbc',
	},

	// ── Storage ID ───────────────────────────────────────────────────────────
	{
		displayName: 'Storage ID',
		name: 'storageId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['storage'], operation: ['getSignedUrl'] } },
		default: '',
		description:
			'S3 storage path of the file. For upload form answers, use the value.value field of the matching answer entry.',
		placeholder: 'e.g. live/image/dev/contents/abc123/photo.jpg',
	},

	// ── Force Download (optional) ────────────────────────────────────────────
	{
		displayName: 'Force Download',
		name: 'attachment',
		type: 'boolean',
		displayOptions: { show: { resource: ['storage'], operation: ['getSignedUrl'] } },
		default: false,
		description:
			'Whether to set Content-Disposition to attachment, forcing a file download instead of inline display in the browser',
	},
];
