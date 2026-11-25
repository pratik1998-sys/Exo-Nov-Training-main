import { RequestContext } from '@context/request';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DBTutorialPetAddressEntity } from './entities/tutorial-pet-db.address.entity';
import * as uuid from 'uuid';
import { DBTutorialPetAddressMapper } from './tutorial-pet-db.address.mapper';
import { AddressService, Address, AddressResultSet, AddressInput, AddressErrors } from '@feature-address';
import { PetErrors } from '@feature-tutorial-pet/pet/pet.error';
import { DBTutorialPetBaseServiceImpl } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.service';

export class DBTutorialPetAddressServiceImpl extends DBTutorialPetBaseServiceImpl implements AddressService {
    async deleteAddress(identifier: string, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${DBTutorialPetAddressServiceImpl.name}.createAddress`;

        const address = await this.getAddressForEdit(identifier, requestContext, context);

        try {
            await this.getDBTutorialPetAddressRepository().delete({ identifier: identifier });
        } catch (error) {
            throw AddressErrors.deleteAddressFailed();
        }

        return address;
    }

    async getAddresses(requestContext: RequestContext, context?: any): Promise<AddressResultSet> {
        throw new Error('Method not implemented.');
    }

    async createAddress(addressInput: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${DBTutorialPetAddressServiceImpl.name}.createAddress`;

        const addressEntity = {
            identifier: uuid.v4(),
            description: '',
            street1: addressInput.line1,
            street2: addressInput.line2,
            street3: addressInput.line3,
            city: addressInput.city,
            state: addressInput.state,
            zipcode: addressInput.postalCode,
            country: addressInput.country,
            email: addressInput.email,
            phone: addressInput.phone,
            type: addressInput.type,
        };

        try {
            const result = await this.getDBTutorialPetAddressRepository().save(addressEntity);

            this.logger.info(`${methodname} - Created Address (${addressEntity.identifier}): ${this.logger.formatJSON(result)}`, requestContext);

            return this.getAddressMapper(requestContext).mapAddress(requestContext, result);
        } catch (error) {
            throw AddressErrors.createAddressFailed();
        }
    }

    async updateAddress(identifier: string, addressInput: AddressInput, fetchAddress: boolean, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${DBTutorialPetAddressServiceImpl.name}.updateAddress`;

        let address = await this.getAddressForEdit(identifier, requestContext, context);

        const addressEntity = {
            firstName: addressInput.firstName,
            middleName: addressInput.middleName,
            lastName: addressInput.lastName,
            street1: addressInput.line1,
            street2: addressInput.line2,
            street3: addressInput.line3,
            city: addressInput.city,
            state: addressInput.state,
            zipcode: addressInput.postalCode,
            country: addressInput.country,
            email: addressInput.email,
            phone: addressInput.phone,
        };

        const options: FindOptionsWhere<DBTutorialPetAddressEntity> = { identifier: identifier };

        try {
            await this.getDBTutorialPetAddressRepository().update(options, addressEntity);
        } catch (error) {
            throw AddressErrors.updateAddressFailed();
        }

        const result = await this.getDBTutorialPetAddressRepository().findOne({ where: { identifier: identifier } });

        this.logger.info(`${methodname} - Updated Address (${identifier}): ${this.logger.formatJSON(result)}`, requestContext);

        return await this.getAddress(identifier, requestContext, context);
    }

    async getAddress(identifier: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${DBTutorialPetAddressServiceImpl.name}.getAddress`;

        const result = await this.getDBTutorialPetAddressRepository().findOne({ where: { identifier: identifier } });

        if (result == null) {
            this.logger.info(`${methodname} - Address (${identifier}) Not Found`, requestContext);

            throw AddressErrors.getAddressFailed();
        }

        this.logger.info(`${methodname} - Address (${identifier}): ${this.logger.formatJSON(result)}`, requestContext);

        return this.getAddressMapper(requestContext).mapAddress(requestContext, result);
    }

    private async getAddressForEdit(identifier: string, requestContext: RequestContext, context?: any): Promise<Address> {
        const methodname = `${DBTutorialPetAddressServiceImpl.name}.getAddressForEdit`;

        const result = await this.getDBTutorialPetAddressRepository().findOne({ where: { identifier: identifier } });

        if (result && !result.canEdit) {
            throw PetErrors.notEditabled();
        }

        return this.getAddressMapper(requestContext).mapAddress(requestContext, result);
    }

    protected getAddressMapper(requestContext: RequestContext) {
        return this.getMapper<DBTutorialPetAddressMapper>(requestContext, DBTutorialPetAddressMapper);
    }

    protected getDBTutorialPetAddressRepository(): Repository<DBTutorialPetAddressEntity> {
        return this.getRepository<Repository<DBTutorialPetAddressEntity>>(DBTutorialPetAddressEntity);
    }
}
