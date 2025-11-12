import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

/**
 * Generates API URL from client URL by inserting 'api' subdomain
 * @param clientUrl - The client URL to convert
 * @returns The API URL
 */
export function generateApiUrl(clientUrl: string): string {
	try {
		const url = new URL(clientUrl);
		const hostname = url.hostname;
		const parts = hostname.split('.');

		if (parts.length >= 2) {
			const subdomain = parts[0];
			const domain = parts.slice(1).join('.');
			const apiHostname = `${subdomain}.api.${domain}`;
			url.hostname = apiHostname;
			return url.toString().replace(/\/$/, '');
		}

		return clientUrl;
	} catch {
		throw new Error(`Invalid client URL: ${clientUrl}`);
	}
}

/**
 * Acquires API token from Keephub using credentials
 * @param this - The execution context
 * @returns The API token
 */
export async function acquireApiToken(this: IExecuteFunctions): Promise<string> {
	const credentials = (await this.getCredentials('keephubApi')) as {
		clientUrl: string;
		authType: string;
		bearerToken?: string;
		loginName?: string;
		password?: string;
		language?: string;
	};

	const clientUrl = credentials.clientUrl;
	const baseUrl = generateApiUrl(clientUrl);
	const authType = credentials.authType;

	let apiToken: string;

	if (authType === 'bearerToken') {
		apiToken = credentials.bearerToken as string;
	} else if (authType === 'apiCredentials') {
		const loginName = credentials.loginName as string;
		const password = credentials.password as string;

		try {
			const tokenResponse = (await this.helpers.httpRequest({
				method: 'POST',
				url: `${baseUrl}/authentication`,
				headers: { 'Content-Type': 'application/json' },
				body: {
					loginName,
					password,
				},
			} as IHttpRequestOptions)) as JsonObject;

			const token = (tokenResponse.accessToken || tokenResponse.token) as string;

			if (!token) {
				throw new NodeApiError(this.getNode(), tokenResponse, {
					message: 'No access token returned from authentication endpoint',
				});
			}

			apiToken = token;
		} catch (error) {
			if (error instanceof NodeApiError) {
				throw error;
			}
			throw new NodeApiError(this.getNode(), error as JsonObject, {
				message: 'Failed to authenticate with Keephub',
			});
		}
	} else {
		throw new NodeOperationError(this.getNode(), `Unsupported authentication type: ${authType}`);
	}

	return apiToken;
}

/**
 * Makes an authenticated API request to Keephub
 * @param this - The execution context
 * @param method - HTTP method
 * @param endpoint - API endpoint path
 * @param body - Request body (optional)
 * @returns The API response
 */
export async function apiRequest(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
): Promise<IDataObject> {
	const credentials = (await this.getCredentials('keephubApi')) as {
		clientUrl: string;
		authType: string;
		bearerToken?: string;
		loginName?: string;
		password?: string;
		language?: string;
	};

	const baseUrl = generateApiUrl(credentials.clientUrl);
	const apiToken = await acquireApiToken.call(this);
	const language = credentials.language || 'en';

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
		headers: {
			Authorization: `Bearer ${apiToken}`,
			'Content-Type': 'application/json',
			lang: language,
		},
		json: true,
	};

	if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
		options.body = body;
	}

	try {
		return (await this.helpers.httpRequest(options)) as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}

/**
 * Validates MongoDB ObjectID format
 * @param this - The execution context
 * @param id - The ID to validate
 * @param fieldName - Name of the field being validated
 * @param itemIndex - Index of the item being processed
 */
export function validateMongoId(
	this: IExecuteFunctions,
	id: string,
	fieldName: string,
	itemIndex: number,
): void {
	if (!id || !id.match(/^[a-f\d]{24}$/i)) {
		throw new NodeOperationError(
			this.getNode(),
			`Invalid ${fieldName}. Expected 24 hexadecimal characters (MongoDB ObjectID format)`,
			{ itemIndex },
		);
	}
}

/**
 * Parses JSON parameter with error handling
 * @param this - The execution context
 * @param input - Input to parse (string or object)
 * @param parameterName - Name of the parameter
 * @param itemIndex - Index of the item being processed
 * @returns Parsed JSON object
 */
export function parseJsonParameter(
	this: IExecuteFunctions,
	input: unknown,
	parameterName: string,
	itemIndex: number,
): IDataObject {
	if (input === null || input === undefined) {
		throw new NodeOperationError(this.getNode(), `${parameterName} is required`, { itemIndex });
	}

	if (typeof input === 'string') {
		try {
			return JSON.parse(input) as IDataObject;
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON in ${parameterName}`, {
				description: `Please check your JSON syntax. Error: ${(error as Error).message}`,
				itemIndex,
			});
		}
	}

	return input as IDataObject;
}
