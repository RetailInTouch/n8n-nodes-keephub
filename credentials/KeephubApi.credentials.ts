import {
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class KeephubApi implements ICredentialType {
	name = 'keephubApi';
	displayName = 'Keephub API';
	documentationUrl = 'https://github.com/RetailInTouch/n8n-nodes-keephub/blob/master/README.md'; 
	icon = 'file:Keephub.svg' as const; 

	properties: INodeProperties[] = [
		{
			displayName: 'Client URL',
			name: 'clientUrl',
			type: 'string',
			default: '',
			placeholder: 'https://kega.keephub.io',
			description: 'Your Keephub instance URL (e.g. https://kega.keephub.io)',
		},
		{
			displayName: 'Authentication Type',
			name: 'authType',
			type: 'options',
			options: [
				{
					name: 'Bearer Token',
					value: 'bearerToken',
					description: 'Use a JWT Bearer token directly',
				},
				{
					name: 'Get Token via API',
					value: 'apiCredentials',
					description: 'Use loginName/password to get a token',
				},
			],
			default: 'bearerToken',
			description: 'Choose how you want to authenticate',
		},
		{
			displayName: 'Bearer Token (JWT)',
			name: 'bearerToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			displayOptions: {
				show: {
					authType: ['bearerToken'],
				},
			},
			default: '',
			placeholder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
			description: 'Your JWT Bearer token from Keephub',
		},
		{
			displayName: 'Login Name',
			name: 'loginName',
			type: 'string',
			displayOptions: {
				show: {
					authType: ['apiCredentials'],
				},
			},
			default: '',
			placeholder: 'loginName',
			description: 'Your Keephub Login Name or email',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			displayOptions: {
				show: {
					authType: ['apiCredentials'],
				},
			},
			default: '',
			description: 'Your Keephub password',
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
			displayOptions: {
				show: {
					authType: ['apiCredentials'],
				},
			},
			default: '/authentication',
			description: 'The endpoint to get your token (/authentication for Keephub)',
			typeOptions: { password: true },
		},
	];

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.clientUrl}}',
			url: '/api/user/current',
			headers: {
				Authorization: '=Bearer {{$credentials.bearerToken}}',
			},
		},
	};
}
