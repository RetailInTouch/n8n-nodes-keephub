import { IExecuteFunctions, NodeOperationError } from "n8n-workflow";

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
  } catch (error) {
    throw new Error(`Invalid client URL: ${clientUrl}`);
  }
}

export async function acquireApiToken(this: IExecuteFunctions): Promise<string> {
  const credentials = await this.getCredentials('keephubApi');
  const clientUrl = credentials.clientUrl as string;
  const baseUrl = generateApiUrl(clientUrl);
  const authType = credentials.authType as string;

  let apiToken: string;

  if (authType === 'bearerToken') {
    apiToken = credentials.bearerToken as string;
  } else if (authType === 'apiCredentials') {
    const username = credentials.username as string;
    const password = credentials.password as string;

    try {
      const tokenResponse = await this.helpers.httpRequest({
        method: 'POST',
        url: `${baseUrl}/authentication`,
        headers: { 'Content-Type': 'application/json' },
        body: {
          loginName: username,
          password: password,
        },
      });

      apiToken = tokenResponse.accessToken || tokenResponse.token;
    } catch (error: any) {
      throw new NodeOperationError(this.getNode(), 'Failed to get token from Keephub', {
        description: (error as Error).message,
      });
    }
  } else {
    throw new NodeOperationError(this.getNode(), `Unsupported authType: ${authType}`);
  }

  return apiToken;
}

//Use it in files like this:
// import { generateApiUrl, acquireApiToken } from '../../utils/helpers';

// export async function execute(
//   this: IExecuteFunctions,
//   item: INodeExecutionData,
//   index: number,
// ): Promise<IDataObject> {
//   const userId = this.getNodeParameter('userId', index) as string;

//   const apiToken = await acquireApiToken.call(this);
//   const credentials = await this.getCredentials('keephubApi');
//   const baseUrl = generateApiUrl(credentials.clientUrl);

//   const response = await this.helpers.httpRequest({
//     method: 'GET',
//     url: `${baseUrl}/users/${userId}`,
//     headers: {
//       Authorization: `Bearer ${apiToken}`,
//     },
//     json: true,
//   });

//   return response;
// }
