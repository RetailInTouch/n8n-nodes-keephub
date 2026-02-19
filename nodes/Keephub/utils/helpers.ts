import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

/**
 * Cache for API tokens per execution to avoid re-authenticating on every request.
 * Uses a WeakMap keyed by the execution context so entries are automatically
 * garbage-collected when the execution completes.
 */
const tokenCache = new WeakMap<object, string>();

/**
 * Generates API URL from client URL by inserting 'api' subdomain
 * @param clientUrl - The client URL to convert
 * @returns The API URL
 */
export function generateApiUrl(clientUrl: string): string {
	try {
		let raw = clientUrl;
		if (!/^https?:\/\//i.test(raw)) {
			raw = `https://${raw}`;
		}
		const url = new URL(raw);
		const hostname = url.hostname;
		if (hostname.includes('.api.')) {
			const value = url.toString();
			return value.endsWith('/') ? value.slice(0, -1) : value;
		}
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
 * Resolves the active credential type and returns its data
 * @param this - The execution context
 * @returns Object with authType and credentials
 */
async function getActiveCredentials(
	this: IExecuteFunctions,
): Promise<{
	authType: string;
	credentials: {
		clientUrl: string;
		bearerToken?: string;
		loginName?: string;
		password?: string;
		language?: string;
		authEndpoint?: string;
		tokenEndpoint?: string;
	};
}> {
	const authType = this.getNodeParameter('authentication', 0) as string;

	if (authType === 'bearerToken') {
		const credentials = (await this.getCredentials('keephubBearerApi')) as {
			clientUrl: string;
			bearerToken: string;
			language?: string;
		};
		return { authType, credentials };
	}

	const credentials = (await this.getCredentials('keephubLoginApi')) as {
		clientUrl: string;
		loginName: string;
		password: string;
		language?: string;
		authEndpoint?: string;
		tokenEndpoint?: string;
	};
	return { authType, credentials };
}

/**
 * Acquires API token from Keephub using credentials
 * @param this - The execution context
 * @returns The API token
 */
export async function acquireApiToken(this: IExecuteFunctions): Promise<string> {
	const { authType, credentials } = await getActiveCredentials.call(this);

	if (authType === 'bearerToken') {
		return credentials.bearerToken as string;
	}

	// Return cached token if available (avoids re-authenticating per API call)
	const cached = tokenCache.get(this);
	if (cached) {
		return cached;
	}

	// Login credentials flow
	const baseUrl = generateApiUrl(credentials.clientUrl);
	const loginName = credentials.loginName as string;
	const password = credentials.password as string;
	const tokenEndpoint = credentials.authEndpoint || credentials.tokenEndpoint || '/authentication';

	try {
		const tokenResponse = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${baseUrl}${tokenEndpoint}`,
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

		// Cache the token for subsequent calls within this execution
		tokenCache.set(this, token);

		return token;
	} catch (error) {
		if (error instanceof NodeApiError) {
			throw error;
		}
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: 'Failed to authenticate with Keephub',
		});
	}
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
	const { credentials } = await getActiveCredentials.call(this);

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
