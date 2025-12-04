import type { INodeExecutionData, IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { apiRequest } from '../../utils/helpers';

export const description = {
    displayName: 'Get by External Ref',
    name: 'getByExternalRef',
    action: 'Get an orgchart node by external reference',
    description: 'Retrieve a single orgchart node by external reference',
};

export async function execute(
    this: IExecuteFunctions,
    item: INodeExecutionData,
    index: number,
): Promise<INodeExecutionData[]> {
    const externalRef = this.getNodeParameter('externalRef', index) as string;

    if (!externalRef) {
        throw new NodeOperationError(this.getNode(), 'External Reference is required', { itemIndex: index });
    }

    const response = (await apiRequest.call(
        this,
        'GET',
        `/orgchart/?externalRef=${encodeURIComponent(externalRef)}`
    )) as IDataObject;

    return [
        {
            json: response,
            pairedItem: { item: index },
        },
    ];
}
