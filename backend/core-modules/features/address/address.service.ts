import { Address, AddressFilterInput, AddressInput, AddressResultSet } from "./address.model";
import { RequestContext } from "@context/request";
import { PaginationInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";

export abstract class AddressService extends BaseFeatureService {
    abstract createAddress(address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address>;
    abstract updateAddress(id: string, address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address>;
    abstract deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address>;
    abstract getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address>;
    abstract getAddresses(filter: AddressFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<AddressResultSet>;
}
