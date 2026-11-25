import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { DBTutorialPetPharmacyEntity } from './entities/tutorial-pet-db.pharmacy.entity';
import { RequestContext } from '@context/request';
import { StringUtility } from '@utilities';
import { DBTutorialPetPharmacyMapper } from './tutorial-pet-db.pharmacy.mapper';
import { v4 as uuidv4 } from 'uuid';
import { DBTutorialPetBaseServiceImpl } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.service';
import { PharmacyService } from '@feature-tutorial-pet/pharmacy/pharmacy.service';
import { PharmacyFilterInput, PharmacyResultSet, PharmacyInput, Pharmacy } from '@feature-tutorial-pet/pharmacy/pharmacy.model';
import { AddressService } from '@feature-address';
import { PaginationInput } from '@feature/models';
import { PharmacyErrors } from '@feature-tutorial-pet/pharmacy/pharmacy.error';

export class DBTutorialPetPharmacyServiceImpl extends DBTutorialPetBaseServiceImpl implements PharmacyService {
    async getPharmacies(filterInput: PharmacyFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PharmacyResultSet> {
        const methodname = `${DBTutorialPetPharmacyServiceImpl.name}.getPharmacies`;

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        let results = [];
        let total = 0;

        if (StringUtility.isStringNotEmpty(requestContext.user?.email)) {
            const pharmacyOptions: FindManyOptions<DBTutorialPetPharmacyEntity> = {
                relations: {
                    address: true,
                },
                skip: offset,
                take: limit,
            };

            const [entities, count] = await this.getDBTutorialPetPharmacyRepository().findAndCount(pharmacyOptions);

            results = entities;
            total = count;

            this.logger.info(`${methodname} - Pharmacies: ${this.logger.formatJSON(entities)}`, requestContext);
        }

        return this.getMapper<DBTutorialPetPharmacyMapper>(requestContext).mapPharmacyResultSet(requestContext, results, total, limit, offset);
    }

    async getPharmacy(identifier: string, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${DBTutorialPetPharmacyServiceImpl.name}.getPharmacy`;

        const pharmacyOptions: FindOneOptions<DBTutorialPetPharmacyEntity> = {
            where: {
                identifier,
            },
            relations: {
                address: true,
            },
        };

        const pharmacy = await this.getDBTutorialPetPharmacyRepository().findOne(pharmacyOptions);

        if (pharmacy) {
            return this.getMapper<DBTutorialPetPharmacyMapper>(requestContext).mapPharmacy(requestContext, pharmacy);
        } else {
            throw PharmacyErrors.getPharmacyFailed();
        }
    }

    async createPharmacy(pharmacyInput: PharmacyInput, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${DBTutorialPetPharmacyServiceImpl.name}.createPharmacy`;

        this.checkAuthorizationAdmin(requestContext);

        let pharmacy = null;

        try {
            pharmacy = await this.getPharmacy(pharmacyInput.email, requestContext, context);
        } catch (error) { }

        if (pharmacy == null) {
            pharmacyInput.address.type = 'PHARMACY';

            const address = await this.getAddressService(requestContext).createAddress(pharmacyInput.address, true, requestContext, context);

            const pharmacyEntity = {
                identifier: uuidv4(),
                name: pharmacyInput.name,
                description: pharmacyInput.description,
                type: pharmacyInput.type,
                email: pharmacyInput.email,
                phone: pharmacyInput.phone,
                addressIdentifier: address.identifier,
            };

            try {
                const result = await this.getDBTutorialPetPharmacyRepository().save(pharmacyEntity);

                pharmacy = await this.getPharmacy(result.identifier, requestContext, context);

                this.logger.info(`${methodname} - Created pharmacy (${pharmacy.identifier}): ${this.logger.formatJSON(pharmacy)}`, requestContext);

                return pharmacy;
            } catch (error) {
                throw PharmacyErrors.createPharmacyFailed();
            }
        } else {
            throw PharmacyErrors.pharmacyExists();
        }
    }

    async updatePharmacy(identifier: string, pharmacyInput: PharmacyInput, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${DBTutorialPetPharmacyServiceImpl.name}.updatePharmacy`;

        this.checkAuthorizationAdmin(requestContext);

        let pharmacy = await this.getPharmacyForEdit(identifier, requestContext, context);

        if (pharmacyInput.address) {
            await this.getAddressService(requestContext).updateAddress(pharmacyInput.address.identifier, pharmacyInput.address, true, requestContext, context);
        }

        const pharmacyEntity = {
            name: pharmacyInput.name,
            description: pharmacyInput.description,
            type: pharmacyInput.type,
            email: pharmacyInput.email,
            phone: pharmacyInput.phone,
        };

        if (
            Object.values(pharmacyEntity).find((val) => {
                return val != undefined;
            })
        ) {
            const options: FindOptionsWhere<DBTutorialPetPharmacyEntity> = { identifier: identifier };

            try {
                await this.getDBTutorialPetPharmacyRepository().update(options, pharmacyEntity);
            } catch (error) {
                throw PharmacyErrors.updatePharmacyFailed();
            }
        }

        pharmacy = await this.getPharmacy(identifier, requestContext, context);

        this.logger.info(`${methodname} - Updated pharmacy (${identifier}): ${this.logger.formatJSON(pharmacy)}`, requestContext);

        return pharmacy;
    }

    async deletePharmacy(identifier: string, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${DBTutorialPetPharmacyServiceImpl.name}.deletePharmacy`;

        this.checkAuthorizationAdmin(requestContext);

        let pharmacy = await this.getPharmacyForEdit(identifier, requestContext, context);

        try {
            await this.getDBTutorialPetPharmacyRepository().delete({ identifier: identifier });
            await this.getAddressService(requestContext).deleteAddress(pharmacy.address.identifier, true, requestContext, context);
        } catch (error) {
            throw PharmacyErrors.deletePharmacyFailed();
        }

        this.logger.info(`${methodname} - Deleted pharmacy (${identifier}): ${this.logger.formatJSON(pharmacy)}`, requestContext);

        return pharmacy;
    }

    protected async fetchPharmacy(requestContext: RequestContext, identifier: string, whereClause: any = {}) {
        return await this.getDBTutorialPetPharmacyRepository().findOne({
            where: {
                identifier: identifier,
                ...whereClause,
            },
            relations: {
                address: true,
            },
        });
    }

    private async getPharmacyForEdit(identifier: string, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${DBTutorialPetPharmacyServiceImpl.name}.getPharmacyForEdit`;

        const result = await this.fetchPharmacy(requestContext, identifier);

        if (result && !result.canEdit) {
            throw PharmacyErrors.pharmacyNotEditable();
        }

        return this.getMapper<DBTutorialPetPharmacyMapper>(requestContext).mapPharmacy(requestContext, result);
    }

    protected getAddressService(requestContext: RequestContext) {
        return this.getService<AddressService>(requestContext, AddressService);
    }

    protected getDBTutorialPetPharmacyRepository(): Repository<DBTutorialPetPharmacyEntity> {
        return this.getRepository<Repository<DBTutorialPetPharmacyEntity>>(DBTutorialPetPharmacyEntity);
    }
}
