import { Account, AccountResultSet } from './account.model';
import { AccountRequestParameters } from './account.parameters';
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';

export interface AccountApiOperations {
    accounts: ApiOperationDefinition;
    account: ApiOperationDefinition;
}

export class AccountApiConfiguration extends ApiConfiguration {
    static operations: AccountApiOperations = {
        accounts: {
            id: 'accounts',
            description: 'Get accounts',
            summary: 'Get accounts',
            isAuthRequired: true,
            restOptions: {
                apiOkResponseOptions: {
                    type: AccountResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        account: {
            id: 'account',
            description: 'Get account',
            summary: 'Get account',
            isAuthRequired: true,
            restOptions: {
                isById: true,
                path: `:${AccountRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Account,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
    };

    static accounts(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.accounts);
    }

    static account(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.account);
    }
}
