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
			placeholder: 'https://yourcompany.keephub.io',
			description:
				'Your Keephub instance URL (e.g. https://yourcompany.keephub.io). Do not use the API URL.',
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
			name: 'authEndpoint',
			type: 'string',
			default: '/authentication',
			description: 'Authentication endpoint path (default: /authentication)',
		},
	];

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL:
				'={{(() => { let r = ($credentials.clientUrl || "").trim(); if (!r.includes("://")) r = "https://" + r; if (r.endsWith("/")) r = r.slice(0, -1); if (r.includes(".api.")) return r; const p = r.indexOf("://") + 3; const d = r.indexOf(".", p); if (d > -1) r = r.substring(0, d) + ".api" + r.substring(d); return r; })()}}',
			url: '={{$credentials.authEndpoint?.startsWith("/") ? $credentials.authEndpoint : `/${$credentials.authEndpoint || "authentication"}`}}',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				loginName: '={{$credentials.loginName}}',
				password: '={{$credentials.password}}',
			},
			json: true,
		},
	};
}
