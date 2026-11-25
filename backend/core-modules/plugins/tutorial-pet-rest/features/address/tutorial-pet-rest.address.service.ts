import { RequestContext } from '@context/request';
import { TutorialPetRestBaseServiceImpl } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.service';
import { AddressInput, Address, AddressResultSet, AddressService } from '@feature-address';

export class TutorialPetRestAddressServiceImpl extends TutorialPetRestBaseServiceImpl implements AddressService {
    async createAddress(address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetRestAddressServiceImpl.name}.createAddress`;

        throw new Error('Method not implemented.');
    }

    async updateAddress(id: string, address: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetRestAddressServiceImpl.name}.updateAddress`;

        throw new Error('Method not implemented.');
    }

    async deleteAddress(id: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetRestAddressServiceImpl.name}.deleteAddress`;

        throw new Error('Method not implemented.');
    }

    async getAddress(id: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${TutorialPetRestAddressServiceImpl.name}.getAddress`;

        throw new Error('Method not implemented.');
    }

    async getAddresses(requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        const methodname = `${TutorialPetRestAddressServiceImpl.name}.getAddresses`;

        throw new Error('Method not implemented.');
    }
}
