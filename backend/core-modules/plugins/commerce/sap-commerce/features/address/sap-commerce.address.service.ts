import { RequestContext } from "@context/request";
import { AddressService, AddressInput, Address, AddressFilterInput, AddressResultSet } from "@feature-address";
import { PaginationInput } from "@feature/models";
import { SAPCommerceECUserServiceImpl } from "@plugin-sap-commerce/features/ec-user";

export class SAPCommerceAddressServiceImpl extends SAPCommerceECUserServiceImpl implements AddressService {
    createAddress(address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        throw new Error('Method not implemented.');
    }
    updateAddress(id: string, address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        throw new Error('Method not implemented.');
    }
    deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        throw new Error('Method not implemented.');
    }
    getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address> {
        throw new Error('Method not implemented.');
    }
    getAddresses(filter: AddressFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        throw new Error('Method not implemented.');
    }
}
