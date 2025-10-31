import { IExecuteFunctions } from 'n8n-workflow';
import {
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

// Helper function to generate API URL from client URL
function generateApiUrl(clientUrl: string): string {
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

export class Keephub implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Keephub',
    name: 'keephub',
    icon: 'file:Keephub.png',
    group: ['transform'],
    version: 1,
    description: 'Interact with Keephub API',
    defaults: {
      name: 'Keephub',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'keephubApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Auth',
            value: 'auth',
          },
          {
            name: 'User',
            value: 'user',
          },
          {
            name: 'Content',
            value: 'content',
          },
        ],
        default: 'auth',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['auth'],
          },
        },
        options: [
          {
            name: 'Get Token',
            value: 'getToken',
            description: 'Get authentication token from credentials',
          },
        ],
        default: 'getToken',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['user'],
          },
        },
        options: [
          {
            name: 'Get User',
            value: 'getUser',
            description: 'Get a user by ID',
          },
          {
            name: 'Find User',
            value: 'findUser',
            description: 'Find user by email',
          },
        ],
        default: 'getUser',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['getUser'],
          },
        },
        default: '',
        placeholder: '63bd885034d0466d11073575',
        description: 'The ID of the user to retrieve',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        displayOptions: {
          show: {
            resource: ['user'],
            operation: ['findUser'],
          },
        },
        default: '',
        placeholder: 'user@example.com',
        description: 'Email address to search for',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['content'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create new content',
          },
          {
            name: 'Get',
            value: 'get',
            description: 'Get content by ID',
          },
        ],
        default: 'create',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    // Get credentials
    const credentials = await this.getCredentials('keephubApi');
    const clientUrl = credentials.clientUrl as string;
    const baseUrl = generateApiUrl(clientUrl);
    const authType = credentials.authType as string;

    // Get the appropriate token
    let apiToken: string;

    if (authType === 'bearerToken') {
      // Use the provided bearer token directly
      apiToken = credentials.bearerToken as string;
    } else if (authType === 'apiCredentials') {
      // Get token from API using username/password
      const username = credentials.username as string;
      const password = credentials.password as string;
      const tokenEndpoint = credentials.tokenEndpoint as string;

      try {
        const tokenResponse = await this.helpers.httpRequest({
          method: 'POST',
          url: `${baseUrl}${tokenEndpoint}`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: {
            username: username,
            password: password,
          },
        });

        // Assuming the response contains accessToken or token field
        apiToken = tokenResponse.accessToken || tokenResponse.token;
      } catch (error) {
        throw new Error(`Failed to get token from Keephub: ${(error as Error).message}`);
      }
    } else {
      throw new Error('Invalid authentication type');
    }

    // Now execute the requested operation
    for (let i = 0; i < items.length; i++) {
      try {
        if (resource === 'auth') {
          if (operation === 'getToken') {
            // Return the token
            returnData.push({
              json: {
                accessToken: apiToken,
                baseUrl: baseUrl,
                authType: authType,
              },
            });
          }
        } else if (resource === 'user') {
          if (operation === 'getUser') {
            const userId = this.getNodeParameter('userId', i) as string;

            const response = await this.helpers.httpRequest({
              method: 'GET',
              url: `${baseUrl}/api/users/${userId}`,
              headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
              },
            });

            returnData.push({ json: response });
          } else if (operation === 'findUser') {
            const email = this.getNodeParameter('email', i) as string;

            const response = await this.helpers.httpRequest({
              method: 'GET',
              url: `${baseUrl}/api/users?email=${encodeURIComponent(email)}`,
              headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
              },
            });

            returnData.push({ json: response });
          }
        } else if (resource === 'content') {
          if (operation === 'create') {
            // The body should come from the input data
            const body = items[i].json;

            const response = await this.helpers.httpRequest({
              method: 'POST',
              url: `${baseUrl}/api/contents`,
              headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
              },
              body: body,
            });

            returnData.push({ json: response });
          } else if (operation === 'get') {
            const contentId = this.getNodeParameter('contentId', i) as string;

            const response = await this.helpers.httpRequest({
              method: 'GET',
              url: `${baseUrl}/api/contents/${contentId}`,
              headers: {
                'Authorization': `Bearer ${apiToken}`,
                'Content-Type': 'application/json',
              },
            });

            returnData.push({ json: response });
          }
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
        } else {
          throw error;
        }
      }
    }

    return [returnData];
  }
}
