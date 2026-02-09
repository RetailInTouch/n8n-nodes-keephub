import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KeephubLoginApi implements ICredentialType {
	name = 'keephubLoginApi';
	displayName = 'Keephub Login API';
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
			displayName: 'Login Name',
			name: 'loginName',
			type: 'string',
			default: '',
			placeholder: 'loginName',
			description: 'Your Keephub Login Name or email',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Your Keephub password',
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
		{
			displayName: 'Token Endpoint',
			name: 'tokenEndpoint',
			type: 'string',
			default: '/authentication',
			description: 'The endpoint to get your token (/authentication for Keephub)',
			typeOptions: { password: true },
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.clientUrl}}',
			url: '/api/user/current',
		},
	};
}
