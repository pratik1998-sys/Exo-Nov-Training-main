import { RequestContext } from "@context/request";
import { Address, AddressFilterInput, AddressResultSet, AddressInput, AddressErrors } from "@feature-address";
import { ECAuthenticateService } from "@feature-commerce/ec-authenticate";
import { ECUser, ECUserCreate, ECUserCreateInput, ECUserErrors, ECUserInput, ECUserService } from "@feature-commerce/ec-user";
import { PaginationInput } from "@feature/models";
import { AdobeCommerceBaseServiceImpl } from "@plugin-adobe-commerce/common";
import { AdobeCommerceRegionCountryRegistry } from "@plugin-adobe-commerce/features/region";
import { AdobeCommerceECUserDatasource } from "./adobe-commerce.ec-user.datasource";
import { AdobeCommerceECUserMapper } from "./adobe-commerce.ec-user.mapper";
import { AdobeCommerceCustomer, AdobeCommerceCreateCustomerInput, AdobeCommerceCustomerAddress, AdobeCommerceCustomerAddressInput } from "./schema/adobe-commerce.ec-user.schema";
import { StringUtility } from "@utilities";

export class AdobeCommerceECUserServiceImpl extends AdobeCommerceBaseServiceImpl implements ECUserService {
    async createUser(userInput: ECUserCreateInput, cartId: string, requestContext: RequestContext, context?: any): Promise<ECUserCreate> {
        const methodname = `${AdobeCommerceECUserServiceImpl.name}.createUser`;

        let dsECUser: AdobeCommerceCustomer;

        const dsECUserInput: AdobeCommerceCreateCustomerInput = this.composeECUserCreateInput(userInput, requestContext);

        try {
            dsECUser = await this.getDatasource<AdobeCommerceECUserDatasource>(requestContext).createCustomer(requestContext, dsECUserInput);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating user ${userInput.username}: ${error}`);
            throw ECUserErrors.createUserFailed();
        }

        const authentication = await this.getService<ECAuthenticateService>(requestContext, ECAuthenticateService).authenticate(
            userInput.username,
            userInput.password,
            false,
            true,
            cartId,
            requestContext,
            context,
        );

        return this.getMapper<AdobeCommerceECUserMapper>(requestContext).mapECUserCreate(requestContext, dsECUser, authentication);
    }

    async updateUser(identifier: string, customer: ECUserInput, requestContext: RequestContext, context?: any): Promise<ECUser> {
        throw new Error("Method not implemented.");
    }

    async getUser(identifier: string, requestContext: RequestContext, context?: any): Promise<ECUser> {
        const methodname = `${AdobeCommerceECUserServiceImpl.name}.getUser`;

        let dsECUser: AdobeCommerceCustomer;

        try {
            dsECUser = await this.getDatasource<AdobeCommerceECUserDatasource>(requestContext, AdobeCommerceECUserDatasource).getCustomer(requestContext);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching user [${identifier}]: ${error}`);
            throw ECUserErrors.getUserFailed();
        }

        return this.getMapper<AdobeCommerceECUserMapper>(requestContext, AdobeCommerceECUserMapper).mapECUser(requestContext, dsECUser);
    }

    async getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const user = await this.getUser(null, requestContext);

        return user.addresses?.find((address) => address.id == id);
    }

    async getAddresses(filter: AddressFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        const user = await this.getUser(null, requestContext);

        const addresses: Address[] = user.addresses ?? [];

        return {
            pagination: {
                page: 1,
                pageCount: 1,
                pageSize: addresses.length,
                hasMorePages: false,
                resultCount: addresses.length,
            },
            results: addresses,
        };
    }

    async createAddress(address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${AdobeCommerceECUserServiceImpl.name}.createAddress`;

        let dsAddress: AdobeCommerceCustomerAddress;

        const dsAddressInput = this.composeECUserAddressInput(address, requestContext);

        try {
            dsAddress = await this.getDatasource<AdobeCommerceECUserDatasource>(requestContext, AdobeCommerceECUserDatasource).createCustomerAddress(requestContext, dsAddressInput);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating user address ${this.logger.formatJSON(address)}: ${error}`);
            throw AddressErrors.createAddressFailed();
        }

        return this.getMapper<AdobeCommerceECUserMapper>(requestContext, AdobeCommerceECUserMapper).mapAddress(requestContext, dsAddress);
    }

    async updateAddress(id: string, addressInput: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${AdobeCommerceECUserServiceImpl.name}.updateAddress`;

        let dsAddress: AdobeCommerceCustomerAddress;

        const address: Address = await this.getAddress(id, requestContext, context);

        if (address) {
            addressInput = {
                ...address,
                ...addressInput,
            };

            const dsAddressInput = this.composeECUserAddressInput(addressInput, requestContext);

            try {
                dsAddress = await this.getDatasource<AdobeCommerceECUserDatasource>(requestContext, AdobeCommerceECUserDatasource).updateCustomerAddress(requestContext, parseInt(id), dsAddressInput);
            } catch (error) {
                this.logger.info(`${methodname} - Error updating user address [${id}] ${this.logger.formatJSON(addressInput)}: ${error}`);
                throw AddressErrors.updateAddressFailed();
            }
        } else {
            this.logger.info(`${methodname} - ECUser address [${id}] does not exist`);
            throw AddressErrors.updateAddressFailed();
        }

        return this.getMapper<AdobeCommerceECUserMapper>(requestContext, AdobeCommerceECUserMapper).mapAddress(requestContext, dsAddress);
    }

    async deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${AdobeCommerceECUserServiceImpl.name}.deleteAddress`;

        const address = this.getAddress(id, requestContext);

        if (address) {
            try {
                const result = await this.getDatasource<AdobeCommerceECUserDatasource>(requestContext, AdobeCommerceECUserDatasource).deleteCustomerAddress(requestContext, parseInt(id));
            } catch (error) {
                this.logger.info(`${methodname} - Error deleting user address [${id}]: ${error}`);
                throw AddressErrors.deleteAddressFailed();
            }
        } else {
            this.logger.info(`${methodname} - ECUser address [${id}] does not exist`);
            throw AddressErrors.deleteAddressFailed();
        }

        return address;
    }

    protected composeECUserAddressInput(address: AddressInput, requestContext: RequestContext) {
        const street: string[] = [];

        this.addStreetLineToInput(street, address.line1);
        this.addStreetLineToInput(street, address.line2);
        this.addStreetLineToInput(street, address.line3);

        const { consumer, locale } = requestContext;

        const state = this.getRegistry<AdobeCommerceRegionCountryRegistry>(requestContext, AdobeCommerceRegionCountryRegistry).getCountryState(consumer, locale, address.country, address.state);

        const dsAddressInput: AdobeCommerceCustomerAddressInput = {
            region: {
                region_code: address.state,
                region_id: state.id,
            },
            country_code: address.country,
            street,
            telephone: address.phone,
            postcode: address.postalCode,
            city: address.city,
            firstname: address.firstName,
            lastname: address.lastName,
            middlename: address.middleName,
            default_billing: address.isDefault,
            default_shipping: address.isDefault,
        };

        return dsAddressInput;
    }

    protected addStreetLineToInput(streetInput: string[], streetLine: string) {
        if (StringUtility.isStringNotEmpty(streetLine)) {
            streetInput.push(streetLine);
        }
    }

    protected composeECUserCreateInput(userInput: ECUserCreateInput, requestContext: RequestContext): AdobeCommerceCreateCustomerInput {
        const dsECUserInput: AdobeCommerceCreateCustomerInput = {
            date_of_birth: userInput.dateOfBirth,
            email: userInput.username,
            firstname: userInput.firstName,
            middlename: userInput.middleName,
            lastname: userInput.lastName,
            password: userInput.password,
            gender:
                userInput.gender ?
                    userInput.gender == 'male' ?
                        1
                        : 2
                    : undefined,
            is_subscribed: userInput.isMarketingOptIn,
        };

        return dsECUserInput;
    }

    getTokenPurseId(requestContext: RequestContext): string {
        return this.getPluginTokenId(requestContext);
    }
}
