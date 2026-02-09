import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KeephubBearerApi implements ICredentialType {
	name = 'keephubBearerApi';
	displayName = 'Keephub Bearer Token API';
	documentationUrl = 'https://dev.api.keephub.io/api-docs/';
	icon = 'file:Keephub.svg' as const;

	properties: INodeProperties[] = [
		{
			displayName: 'Client URL',
			name: 'clientUrl',
			type: 'string',
			default: '',
			placeholder: 'https://kega.keephub.io',
			description: 'Your Keephub instance URL (e.g. https://kega.keephub.io)',
			required: true,
		},
		{
			displayName: 'Bearer Token (JWT)',
			name: 'bearerToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
			description: 'Your JWT Bearer token from Keephub',
			required: true,
		},
		{
			displayName: 'Language',
			name: 'language',
			type: 'options',
			options: [
				{ name: 'English', value: 'en' },
				{ name: 'Dutch', value: 'nl' },
				{ name: 'Spanish', value: 'es' },
				{ name: 'French', value: 'fr' },
			],
			default: 'en',
			description: 'Default language for API requests',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.bearerToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.clientUrl}}',
			url: '/api/user/current',
		},
	};
}
