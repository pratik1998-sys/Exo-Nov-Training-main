import { RequestContext } from "@context/request";
import { AddressInput, Address, AddressFilterInput, AddressResultSet, AddressErrors } from "@feature-address";
import { ECAuthenticate, ECAuthenticateService } from "@feature-commerce/ec-authenticate";
import { ECUser, ECUserCreate, ECUserCreateInput, ECUserErrors, ECUserInput, ECUserService } from "@feature-commerce/ec-user";
import { PaginationInput } from "@feature/models";
import { CommercetoolsBaseServiceImpl, CommercetoolsEntityActionRequest } from "@plugin-commercetools/common";
import { CommercetoolsAddressMapper, CommercetoolsAddress } from "@plugin-commercetools/features/address";
import { CommercetoolsCustomer, CommercetoolsCustomerAddressRequest, CommercetoolsCustomerCreate, CommercetoolsCustomerCreateResponse } from "./schema/commercetools.ec-user.schema";
import { CommercetoolsCustomerDatasource } from "./commercetools.ec-user.datasource";
import { CommercetoolsECUserMapper } from "./commercetools.ec-user.mapper";
import { StringUtility } from "@utilities";
import { UserErrors } from "@feature-user";


export class CommercetoolsECUserServiceImpl extends CommercetoolsBaseServiceImpl implements ECUserService {
    protected readonly customerActions = {
        addressUpdate: 'changeAddress',
        setDefaultShippingAddress: 'setDefaultShippingAddress',
        setDefaultBillingAddress: 'setDefaultBillingAddress',
        addressCreate: 'addAddress',
        addressDelete: 'removeAddress',
        setFirstName: 'setFirstName',
        setLastName: 'setLastName',
        setMiddleName: 'setMiddleName',
        setDateOfBirth: 'setDateOfBirth',
        setEmail: 'setEmail',
        setPassword: 'setPassword',
        setIsEmailVerified: 'setIsEmailVerified',
        setLocale: 'setLocale',
        setAuthenticationMode: 'setAuthenticationMode',
        setCustomerNumber: 'setCustomerNumber',
        setExternalId: 'setExternalId',
        setTitle: 'setTitle',
        setCompanyName: 'setCompanyName',
        setVatId: 'setVatId',
        setSalutation: 'setSalutation',
        changeEmail: 'changeEmail'
    };

    async createUser(customerInput: ECUserCreateInput, cartId: string, requestContext: RequestContext, context?: any): Promise<ECUserCreate> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.createUser`;

        let dsCustomerCreate: CommercetoolsCustomerCreateResponse;

        const body: CommercetoolsCustomerCreate = {
            email: customerInput.email,
            password: customerInput.password,
            firstName: customerInput.firstName,
            lastName: customerInput.lastName,
            middleName: customerInput.middleName,
            dateOfBirth: customerInput.dateOfBirth,
            isEmailVerified: true,
            locale: requestContext.locale,
            authenticationMode: 'Password',
            // customerNumber: '',
            // externalId: '',
            // title: '',
            // companyName: '',
            // vatId: '',
            // salutation: '',
            // defaultShippingAddress: null,
            // addresses: [],
            // shippingAddressIds: [],
            // billingAddressIds: [],
            // stores: [],
            // customerGroupAssignments: [],
            // anonymousId: requestContext.user.id
        };

        if (StringUtility.isStringNotEmpty(cartId)) {
            body.anonymousCart = {
                id: cartId,
                typeId: 'cart',
            };
        }

        if (customerInput.addresses?.length) {
            body.addresses = customerInput.addresses.map((addressInput) =>
                this.composeAddressInput(requestContext, addressInput),
            );
            body.defaultShippingAddress = 0;
            body.shippingAddressIds = [0];
            body.billingAddressIds = [0];
        }

        try {
            dsCustomerCreate = await this.getECUserDatasource(requestContext).createCustomer(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating user - ${this.logger.formatJSON(customerInput, true)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw ECUserErrors.createUserFailed();
        }

        let authentication: ECAuthenticate = null;

        if (dsCustomerCreate) {
            authentication = await this.getService<ECAuthenticateService>(requestContext, ECAuthenticateService).authenticate(
                customerInput.username,
                customerInput.password,
                false,
                false,
                null,
                requestContext,
                context,
            );
        }

        const user = this.getECUserMapper(requestContext).mapECUser(requestContext, dsCustomerCreate.customer) as ECUserCreate;

        user.authenticate = authentication;

        return user;
    }

    async updateUser(identifier: string, user: ECUserInput, requestContext: RequestContext, context?: any): Promise<ECUser> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.updateUser`;

        let dsCustomer = await this.fetchDSCustomer(requestContext);

        const body: CommercetoolsEntityActionRequest = this.composeEntityAction(dsCustomer.version);

        if (user.firstName) {
            body.actions.push({
                action: this.customerActions.setFirstName,
                firstName: user.firstName,
            });
        }

        if (user.lastName) {
            body.actions.push({
                action: this.customerActions.setLastName,
                lastName: user.lastName,
            });
        }

        if (user.email) {
            body.actions.push({
                action: this.customerActions.changeEmail,
                email: user.email,
            });
        }

        try {
            dsCustomer = await this.getECUserDatasource(requestContext).updateCustomer(requestContext, dsCustomer.id, null, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating user - ${this.logger.formatJSON(body)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw UserErrors.updateUserFailed();
        }

        if (user.phone) {
            dsCustomer = await this.updateUserPhone(dsCustomer, user.phone, requestContext, context);
        }

        return this.getECUserMapper(requestContext).mapECUser(requestContext, dsCustomer);

    }

    protected async updateUserPhone(dsCustomer: CommercetoolsCustomer, phone: string, requestContext: RequestContext, context?: any): Promise<CommercetoolsCustomer> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.updateUserPhone`;

        if (StringUtility.isStringNotEmpty(dsCustomer.defaultShippingAddressId)) {
            const addressInput: AddressInput = {
                phone: phone
            };

            await this.updateAddress(dsCustomer.defaultShippingAddressId, addressInput, false, requestContext, context);
        } else {
            this.logger.info(`${methodname} - Default shipping address not found to update user phone`, requestContext);
            throw UserErrors.updateUserFailed();
        }

        dsCustomer = await this.fetchDSCustomer(requestContext);

        return dsCustomer;
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<ECUser> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.getUser`;

        const dsCustomer = await this.fetchDSCustomer(requestContext);

        return this.getECUserMapper(requestContext).mapECUser(requestContext, dsCustomer);
    }

    async createAddress(addressInput: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.createAddress`;

        let dsCustomer = await this.fetchDSCustomer(requestContext);

        const addressIds: string[] = dsCustomer.addresses.map((dsAddress) => dsAddress.id);

        const body: CommercetoolsEntityActionRequest = this.composeEntityAction(dsCustomer.version);

        body.actions.push({
            action: this.customerActions.addressCreate,
            address: this.composeAddressInput(requestContext, addressInput),
        });

        try {
            dsCustomer = await this.getECUserDatasource(requestContext).updateCustomer(requestContext, dsCustomer.id, null, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating address - ${this.logger.formatJSON(addressInput)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.createAddressFailed();
        }

        const customer = this.getECUserMapper(requestContext).mapECUser(requestContext, dsCustomer);

        return customer.addresses.find((address) => !addressIds.includes(address.id));
    }

    async updateAddress(id: string, addressInput: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.updateAddress`;

        let dsCustomer = await this.fetchDSCustomer(requestContext);

        const dsAddress = this.findAddressForUpdateDelete(id, dsCustomer.addresses, requestContext);

        const body: CommercetoolsCustomerAddressRequest = this.composeEntityAction(dsCustomer.version);

        body.actions.push({
            action: this.customerActions.addressUpdate,
            addressId: dsAddress.id,
            address: this.composeAddressInput(requestContext, addressInput, dsAddress),
        });

        if (addressInput.isDefault) {
            body.actions.push({
                action: this.customerActions.setDefaultShippingAddress,
                addressId: dsAddress.id,
            });
        }

        try {
            dsCustomer = await this.getECUserDatasource(requestContext).updateCustomer(requestContext, dsCustomer.id, null, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating address [${id}] - ${this.logger.formatJSON(addressInput)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.updateAddressFailed();
        }

        const customer = this.getECUserMapper(requestContext).mapECUser(requestContext, dsCustomer);

        return customer.addresses.find((address) => address.id == id);
    }

    async deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.deleteAddress`;

        let dsCustomer = await this.fetchDSCustomer(requestContext);

        const dsAddress = this.findAddressForUpdateDelete(id, dsCustomer.addresses, requestContext);

        const body: CommercetoolsCustomerAddressRequest = this.composeEntityAction(dsCustomer.version);

        body.actions.push({
            action: this.customerActions.addressDelete,
            addressId: id,
        });

        try {
            dsCustomer = await this.getECUserDatasource(requestContext).updateCustomer(requestContext, dsCustomer.id, null, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting address [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.deleteAddressFailed();
        }

        return this.getMapper<CommercetoolsAddressMapper>(requestContext, CommercetoolsAddressMapper).mapAddress(requestContext, dsAddress, dsCustomer);
    }

    async getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const addresses = await this.getCustomerAddresses(requestContext, context);

        const address = addresses.find((address) => address.id == id);

        if (!address) {
            throw AddressErrors.getAddressFailed();
        }

        return address;
    }

    async getAddresses(filter: AddressFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.getAddresses`;

        const addresses = await this.getCustomerAddresses(requestContext, context);

        return {
            pagination: {
                page: 1,
                pageCount: 1,
                pageSize: addresses.length,
                resultCount: addresses.length,
                hasMorePages: false,
            },
            results: addresses,
        };
    }

    protected async fetchDSCustomer(requestContext: RequestContext): Promise<CommercetoolsCustomer> {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.fetchDSCustomer`;

        let dsCustomer: CommercetoolsCustomer = null;

        const ds = this.getECUserDatasource(requestContext);

        try {
            if (requestContext.user?.id) {
                dsCustomer = await ds.getCustomer(requestContext, requestContext.user?.id, null);
            } else {
                dsCustomer = await ds.getMyCustomer(requestContext);
            }
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching customer [${requestContext.user?.id || 'me'}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw ECUserErrors.getUserFailed();
        }

        return dsCustomer;
    }

    protected findAddressForUpdateDelete(id: string, dsAddresses: CommercetoolsAddress[], requestContext: RequestContext): Address {
        const methodname = `${CommercetoolsECUserServiceImpl.name}.getAddressForUpdateDelete`;

        const address = dsAddresses.find((dsAddress) => dsAddress.id == id);

        if (!address) {
            this.logger.info(`${methodname} - Address [${id}] not found`, requestContext);
            throw AddressErrors.addressNotFound();
        }

        return address;
    }

    protected async getCustomerAddresses(requestContext: RequestContext, context?: any): Promise<Address[]> {
        const customer = await this.getUser(null, requestContext, context);

        return customer.addresses;
    }

    protected composeAddressInput(requestContext: RequestContext, addressInput: AddressInput, dsAddress: CommercetoolsAddress = {}): CommercetoolsAddress {
        return this.getMapper<CommercetoolsAddressMapper>(requestContext, CommercetoolsAddressMapper).composeAddressInput(requestContext, addressInput, dsAddress);
    }

    protected getECUserDatasource(requestContext: RequestContext) {
        return this.getDatasource<CommercetoolsCustomerDatasource>(requestContext, CommercetoolsCustomerDatasource);
    }

    protected getECUserMapper(requestContext: RequestContext) {
        return this.getMapper<CommercetoolsECUserMapper>(requestContext, CommercetoolsECUserMapper);
    }

    getTokenPurseId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }
}
