import { RequestContext } from '@context/request';
import { TutorialPetGraphqlBaseServiceImpl } from '@plugin-tutorial-pet-graphql/common/tutorial-pet-graphql.base.service';
import { AddressService } from '@feature-address';
import { AddressInput, Address, AddressResultSet } from '@feature-address';

export class TutorialPetGraphqlAddressServiceImpl extends TutorialPetGraphqlBaseServiceImpl implements AddressService {
    async createAddress(address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetGraphqlAddressServiceImpl.name}.createAddress`;

        throw new Error('Method not implemented.');
    }

    async updateAddress(id: string, address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetGraphqlAddressServiceImpl.name}.updateAddress`;

        throw new Error('Method not implemented.');
    }

    async deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetGraphqlAddressServiceImpl.name}.deleteAddress`;

        throw new Error('Method not implemented.');
    }

    async getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetGraphqlAddressServiceImpl.name}.getAddress`;

        throw new Error('Method not implemented.');
    }

    async getAddresses(requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        const methodname = `${TutorialPetGraphqlAddressServiceImpl.name}.getAddresses`;

        throw new Error('Method not implemented.');
    }
}
