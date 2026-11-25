import { RequestContext } from '@context/request';
import {
    ShopifyCustomer,
    ShopifyCustomerAddressCreateResult,
    ShopifyCustomerAddressDeleteResult,
    ShopifyCustomerAddressUpdateResult,
    ShopifyCustomerCreateInput,
    ShopifyCustomerCreateResult,
    ShopifyCustomerUserError,
    ShopifyUserError,
} from './shopify.ec-user.schema';
import { ShopifyECUserDatasource } from './shopify.ec-user.datasource';
import { ShopifyECUserMapper } from './shopify.ec-user.mapper';
import { ShopifyAddress } from '../address/shopify.address.schema';
import { ShopifyNavigationConsumerConfiguration } from './shopify.ec-user.configuration.type';
import { ShopifyBaseServiceImpl } from '@plugin-shopify/common';
import { ECUser, ECUserCreate, ECUserCreateInput, ECUserErrors, ECUserInput, ECUserService } from '@feature-commerce/ec-user';
import { ECAuthenticateService } from '@feature-commerce/ec-authenticate';
import { AddressInput, Address, AddressResultSet, AddressErrors } from '@feature-address';

export class ShopifyECUserServiceImpl extends ShopifyBaseServiceImpl implements ECUserService {
    async createUser(userInput: ECUserCreateInput, cartId: string, requestContext: RequestContext, context?: any): Promise<ECUserCreate> {
        const methodname = `${ShopifyECUserServiceImpl.name}.createUser`;

        const dsUserInput: ShopifyCustomerCreateInput = this.mapUserInput(requestContext, userInput);

        let dsResult: ShopifyCustomerCreateResult;

        try {
            dsResult = await this.getECUserDatasource(requestContext).createCustomer(requestContext, dsUserInput);

            this.handleErrors(dsResult);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating user [${userInput.username}] - ${this.logger.formatJSON(userInput, true)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw ECUserErrors.createUserFailed();
        }

        const authenticate = await this.getService<ECAuthenticateService>(requestContext, ECAuthenticateService).authenticate(
            userInput.username,
            userInput.password,
            false,
            true,
            cartId,
            requestContext,
            context,
        );

        const user: ECUserCreate = this.getECUserMapper(requestContext).mapUser(requestContext, dsResult.customer) as ECUserCreate;

        user.authenticate = authenticate;

        return user;
    }

    async updateUser(identifier: string, customer: ECUserInput, requestContext: RequestContext, context?: any): Promise<ECUser> {
        throw new Error("Method not implemented.");
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<ECUser> {
        const methodname = `${ShopifyECUserServiceImpl.name}.getUser`;

        return await this.getUserWithAddressPagination(identifier, null, null, requestContext, context);
    }

    async createAddress(address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${ShopifyECUserServiceImpl.name}.createAddress`;

        const dsAddressInput: ShopifyAddress = this.mapAddressInput(requestContext, address);

        let dsAddressCreateResult: ShopifyCustomerAddressCreateResult;

        const accessToken = this.getPluginToken(requestContext)?.token;

        try {
            dsAddressCreateResult = await this.getECUserDatasource(requestContext).createCustomerAddress(requestContext, accessToken, dsAddressInput);
            this.handleErrors(dsAddressCreateResult);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating address - ${this.logger.formatJSON(address)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.createAddressFailed();
        }

        return this.getECUserMapper(requestContext).mapAddress(requestContext, dsAddressCreateResult?.customerAddress);
    }

    async updateAddress(id: string, address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${ShopifyECUserServiceImpl.name}.updateAddress`;

        const dsAddressInput: ShopifyAddress = this.mapAddressInput(requestContext, address);

        let dsAddressUpdateResult: ShopifyCustomerAddressUpdateResult;

        const accessToken = this.getPluginToken(requestContext)?.token;

        try {
            dsAddressUpdateResult = await this.getECUserDatasource(requestContext).updateCustomerAddress(requestContext, accessToken, dsAddressInput, id);
            this.handleErrors(dsAddressUpdateResult);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating address [${id}] - ${this.logger.formatJSON(address)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.updateAddressFailed();
        }

        if (address.isDefault) {
            const addressFirst = this.resolveAddressFirst(requestContext);

            try {
                await this.getECUserDatasource(requestContext).updateCustomerDefaultAddress(requestContext, accessToken, id, addressFirst);
            } catch (error) {
                this.logger.info(`${methodname} - Error updating customer default address to [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
                throw AddressErrors.updateAddressFailed();
            }
        }

        return this.getECUserMapper(requestContext).mapAddress(requestContext, dsAddressUpdateResult?.customerAddress);
    }

    async deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${ShopifyECUserServiceImpl.name}.deleteAddress`;

        let address: Address = {};

        // Shopify IDs seem to have the "customerAccessToken" param in it change with every call,
        // thus there is never a match...

        // if (fetchAddress) {
        //     address = await this.getAddress(id, requestContext);
        // }

        let dsAddressDeleteResult: ShopifyCustomerAddressDeleteResult;

        const accessToken = this.getPluginToken(requestContext)?.token;

        try {
            dsAddressDeleteResult = await this.getECUserDatasource(requestContext).deleteCustomerAddress(requestContext, accessToken, id);
            this.handleErrors(dsAddressDeleteResult);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting address [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.deleteAddressFailed();
        }

        address.id = dsAddressDeleteResult.deletedCustomerAddressId;

        return address;
    }

    async getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${ShopifyECUserServiceImpl.name}.getAddress`;

        const addressResultSet: AddressResultSet = await this.getAddresses(requestContext);

        return addressResultSet.results.find((address) => address.id == id);
    }

    /**
     * @todo add pagination input
     *
     * @todo remove hardcoded first 100
     *
     * @param requestContext
     * @param context
     * @returns
     */
    async getAddresses(requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        const methodname = `${ShopifyECUserServiceImpl.name}.getAddresses`;

        const user: ECUser = await this.getUserWithAddressPagination(null, 100, null, requestContext, context);

        return {
            pagination: {
                page: 1,
                hasMorePages: false,
                pageSize: user.addresses.length,
                pageCount: 1,
                resultCount: user.addresses.length,
            },
            results: user.addresses,
        };
    }

    protected async getUserWithAddressPagination(identifier: string, addressFirst: number, addressAfter: string, requestContext: RequestContext, context?: any): Promise<ECUser> {
        const methodname = `${ShopifyECUserServiceImpl.name}.getUser`;

        let dsCustomer: ShopifyCustomer;

        const accessToken = this.getPluginToken(requestContext)?.token;

        addressFirst = this.resolveAddressFirst(requestContext, addressFirst);

        try {
            dsCustomer = await this.getECUserDatasource(requestContext).getCustomer(requestContext, accessToken, addressFirst, addressAfter);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching user: ${this.logger.formatJSON(error)}`, requestContext);
            throw ECUserErrors.getUserFailed();
        }

        return this.getECUserMapper(requestContext).mapUser(requestContext, dsCustomer);
    }

    protected mapUserInput(requestContext: RequestContext, user: ECUserInput): ShopifyCustomerCreateInput {
        const phonePrefix = '+';

        if (user.phone && !user.phone?.startsWith(phonePrefix)) {
            user.phone = `${phonePrefix}${user.phone}`;
        }

        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            password: user.password,
            acceptsMarketing: user.isMarketingOptIn,
        };
    }

    protected handleErrors(dsResult: { customerUserErrors: ShopifyCustomerUserError[]; userErrors: ShopifyUserError[] }) {
        if (dsResult.customerUserErrors?.length > 0) {
            throw dsResult.customerUserErrors[0];
        } else if (dsResult.userErrors?.length > 0) {
            throw dsResult.userErrors[0];
        }
    }

    protected resolveAddressFirst(requestContext: RequestContext, addressFirst?: number) {
        const { configuration } = this.getPluginConsumerConfiguration<ShopifyNavigationConsumerConfiguration>(requestContext);

        addressFirst = addressFirst ?? configuration.addressPagination?.pageSize?.default ?? 25;

        return addressFirst;
    }

    protected getECUserMapper(requestContext: RequestContext) {
        return this.getMapper<ShopifyECUserMapper>(requestContext, ShopifyECUserMapper);
    }

    protected getECUserDatasource(requestContext: RequestContext) {
        return this.getDatasource<ShopifyECUserDatasource>(requestContext, ShopifyECUserDatasource);
    }

    getTokenPurseId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }
}
