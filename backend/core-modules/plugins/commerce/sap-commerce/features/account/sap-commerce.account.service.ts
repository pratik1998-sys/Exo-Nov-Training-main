import { RequestContext } from "@context/request";
import { Account, AccountFilterInput, AccountResultSet, AccountService } from "@feature-account";
import { PaginationInput } from "@feature/models";
import { SAPCommerceECUserServiceImpl } from "@plugin-sap-commerce/features/ec-user";

export class SAPCommerceAccountServiceImpl extends SAPCommerceECUserServiceImpl implements AccountService {
    //TODO - How to fetch all b2b units associated to a user?
    async getAccount(id: string, requestContext: RequestContext, context?: any): Promise<Account> {
        const methodname: string = `${SAPCommerceAccountServiceImpl.name}.getAccount`;

        return null;
    }

    //TODO - How to fetch all b2b units associated to a user?
    async getAccounts(isDetailed: boolean, filter: AccountFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<AccountResultSet> {
        const methodname: string = `${SAPCommerceAccountServiceImpl.name}.getAccounts`;

        return null;
    }
}
