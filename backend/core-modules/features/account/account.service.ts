import { RequestContext } from "@context/request";
import { Account, AccountFilterInput, AccountResultSet } from "./account.model";
import { PaginationInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";

export abstract class AccountService extends BaseFeatureService {
    abstract getAccount(id: string, requestContext: RequestContext, context?: any): Promise<Account>;
    abstract getAccounts(isDetailed: boolean, filter: AccountFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<AccountResultSet>;
}
