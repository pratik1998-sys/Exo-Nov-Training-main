
import { RequestContext } from '@context/request';
import { Address, AddressErrors, AddressFilterInput, AddressInput, AddressResultSet, AddressService } from '@feature-address';
import { PaginationInput } from '@feature/models';
import { HCLCommerceBaseServiceImpl } from '@plugin-hcl-commerce/common';
import { addPersonContact, updatePersonContact } from './schema/hcl-commerce.address.schema';
import { HCLCommerceAddressDatasource } from "./hcl-commerce.address.datasource";
import { HCLCommerceAddressMapper } from "./hcl-commerce.address.mapper";
import { StringUtility } from '@utilities';
import { v4 as uuidv4 } from 'uuid';

export class HCLCommerceAddressServiceImpl extends HCLCommerceBaseServiceImpl implements AddressService {
    async getAddresses(filter: AddressFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        const methodname = `${HCLCommerceAddressServiceImpl.name}.getAddresses`;

        let dsAddresses;

        try {
            dsAddresses = await this.getDatasource<HCLCommerceAddressDatasource>(requestContext, HCLCommerceAddressDatasource).getAllPersonContact(requestContext);

            await this.addDefaultAddressToAddresses(requestContext, dsAddresses?.addressId, dsAddresses);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching addresses: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.getAddressesFailed();
        }

        return this.getMapper<HCLCommerceAddressMapper>(requestContext, HCLCommerceAddressMapper).mapAddressResultSet(requestContext, dsAddresses);
    }

    async getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${HCLCommerceAddressServiceImpl.name}.getAddress`;

        let dsAddress;

        try {
            dsAddress = await this.getDatasource<HCLCommerceAddressDatasource>(requestContext, HCLCommerceAddressDatasource).findPersonContactById(requestContext, id);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching address ${id}: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.getAddressFailed();
        }

        return this.getMapper<HCLCommerceAddressMapper>(requestContext, HCLCommerceAddressMapper).mapAddress(requestContext, dsAddress);
    }

    async createAddress(addressInput: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${HCLCommerceAddressServiceImpl.name}.createAddress`;

        let dsAddress;

        const body = this.composeAddressBody(addressInput, requestContext);

        body.nickName = addressInput.identifier ?? uuidv4();
        body.email1 = addressInput.email ?? requestContext?.user?.email;

        try {
            dsAddress = await this.getDatasource<HCLCommerceAddressDatasource>(requestContext, HCLCommerceAddressDatasource).addPersonContact(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating address ${this.logger.formatJSON(addressInput)}: ${this.logger.formatJSON(error)}`, requestContext);
            throw AddressErrors.createAddressFailed();
        }

        let address: Address =
            fetchAddress ?
                await this.getAddress(dsAddress.addressId, requestContext, context)
                : {
                    id: dsAddress.addressId,
                };

        return address;
    }

    async updateAddress(id: string, addressInput: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${HCLCommerceAddressServiceImpl.name}.updateAddress`;

        let dsAddress;

        const body = this.composeAddressBody(addressInput, requestContext);

        //Get the address by ID first - HCL Commerce only has update by nickname ( identifier), but the input to the  services is addressId...
        let address = await this.getAddress(id, requestContext, context);

        if (address) {
            try {
                dsAddress = await this.getDatasource<HCLCommerceAddressDatasource>(requestContext, HCLCommerceAddressDatasource).updatePersonContact(requestContext, address.identifier, body);
            } catch (error) {
                this.logger.info(`${methodname} - Error updating address [${id}] ${this.logger.formatJSON(addressInput)}: ${this.logger.formatJSON(error)}`, requestContext);
                throw AddressErrors.updateAddressFailed();
            }

            address =
                fetchAddress ?
                    await this.getAddress(dsAddress.addressId, requestContext, context)
                    : {
                        id: dsAddress.addressId,
                    };
        } else {
            this.logger.info(`${methodname} - Address [${id}] not found`, requestContext);
            throw AddressErrors.updateAddressFailed();
        }

        return address;
    }

    async deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${HCLCommerceAddressServiceImpl.name}.deleteAddress`;

        let dsAddress;

        //Get the address by ID first - HCL Commerce only has update by nickname ( identifier), but the input to the  services is addressId...
        let address = await this.getAddress(id, requestContext, context);

        if (address) {
            try {
                dsAddress = await this.getDatasource<HCLCommerceAddressDatasource>(requestContext, HCLCommerceAddressDatasource).deletePersonContact(requestContext, address.identifier);
            } catch (error) {
                this.logger.info(`${methodname} - Error deleting address [${id}]: ${this.logger.formatJSON(error)}`, requestContext);
                throw AddressErrors.deleteAddressFailed();
            }

            address = fetchAddress ? address : { id };
        } else {
            this.logger.info(`${methodname} - Address [${id}] not found`, requestContext);
            throw AddressErrors.deleteAddressFailed();
        }

        return address;
    }

    protected async addDefaultAddressToAddresses(requestContext: RequestContext, addressId: string, dsAddressResultSet: any): Promise<void> {
        if (StringUtility.isStringNotEmpty(addressId)) {
            const dsAddress = await this.getDatasource<HCLCommerceAddressDatasource>(requestContext, HCLCommerceAddressDatasource).findPersonContactById(requestContext, addressId);

            dsAddressResultSet.contact.push(dsAddress);
        }
    }

    protected composeAddressBody(addressInput: AddressInput, requestContext: RequestContext): addPersonContact.Body | updatePersonContact.Body {
        const addressLine: string[] = [];

        this.addAddressLine(addressInput.line1, addressLine);
        this.addAddressLine(addressInput.line2, addressLine);
        this.addAddressLine(addressInput.line3, addressLine);

        let primary;

        if (addressInput.hasOwnProperty('isDefault')) {
            primary = addressInput.isDefault ? '1' : '0';
        }

        const body: addPersonContact.Body | updatePersonContact.Body = {
            addressType: addressInput.type ?? 'SB',
            firstName: addressInput.firstName,
            lastName: addressInput.lastName,
            middleName: addressInput.middleName,
            addressLine,
            city: addressInput.city,
            state: addressInput.state,
            zipCode: addressInput.postalCode,
            country: addressInput.country,
            email1: addressInput.email,
            phone1: addressInput.phone,
            primary,
        };

        return body;
    }

    protected addAddressLine(line: string, addressLine: string[]) {
        if (StringUtility.isStringNotEmpty(line)) {
            addressLine.push(line);
        }
    }
}
