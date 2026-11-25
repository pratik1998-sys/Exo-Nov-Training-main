import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { DBTutorialPetVeterinarianEntity } from './entities/tutorial-pet-db.veterinarian.entity';
import { RequestContext } from '@context/request';
import { StringUtility } from '@utilities';
import { DBTutorialPetVeterinarianMapper } from './tutorial-pet-db.veterinarian.mapper';
import { v4 as uuidv4 } from 'uuid';
import { VeterinarianService } from '@feature-tutorial-pet/veterinarian/veterinarian.service';
import { AddressService } from '@feature-address';
import { PaginationInput } from '@feature/models';
import { VeterinarianFilterInput, VeterinarianResultSet, Veterinarian, VeterinarianInput } from '@feature-tutorial-pet/veterinarian/veterinarian.model';
import { DBTutorialPetBaseServiceImpl } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.service';
import { VeterinarianErrors } from '@feature-tutorial-pet/veterinarian/veterinarian.error';

export class DBTutorialPetVeterinarianServiceImpl extends DBTutorialPetBaseServiceImpl implements VeterinarianService {
    async getVeterinarians(filter: VeterinarianFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<VeterinarianResultSet> {
        const methodname = `${DBTutorialPetVeterinarianServiceImpl.name}.getVeterinarians`;

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        let results = [];
        let total = 0;

        if (StringUtility.isStringNotEmpty(requestContext.user?.email)) {
            const veterinarianOptions: FindManyOptions<DBTutorialPetVeterinarianEntity> = {
                relations: {
                    address: true,
                },
                skip: offset,
                take: limit,
            };

            if (filter?.identifiers) {
                veterinarianOptions.where = {
                    identifier: In(filter.identifiers),
                };
            }

            const [entities, count] = await this.getDBTutorialPetVeterinarianRepository().findAndCount(veterinarianOptions);

            results = entities;
            total = count;

            this.logger.info(`${methodname} - Veterinarians: ${this.logger.formatJSON(entities)}`, requestContext);
        }

        return this.getVeterinarianMapper(requestContext).mapVeterinarianResultSet(requestContext, results, total, limit, offset);
    }

    async getVeterinarian(identifier: string, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${DBTutorialPetVeterinarianServiceImpl.name}.getVeterinarian`;

        const veterinarianOptions: FindOneOptions<DBTutorialPetVeterinarianEntity> = {
            where: {
                identifier,
            },
            relations: {
                address: true,
            },
        };

        const veterinarian = await this.getDBTutorialPetVeterinarianRepository().findOne(veterinarianOptions);

        if (veterinarian) {
            return this.getVeterinarianMapper(requestContext).mapVeterinarian(requestContext, veterinarian);
        } else {
            throw VeterinarianErrors.getVeterinarianFailed();
        }
    }

    async createVeterinarian(veterinarianInput: VeterinarianInput, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${DBTutorialPetVeterinarianServiceImpl.name}.createVeterinarian`;

        this.checkAuthorizationAdmin(requestContext);

        let veterinarian = null;

        try {
            veterinarian = await this.getVeterinarian(veterinarianInput.email, requestContext, context);
        } catch (error) { }

        if (veterinarian == null) {
            veterinarianInput.address.type = 'VETERINARIAN';

            const address = await this.getAddressService(requestContext).createAddress(veterinarianInput.address, true, requestContext, context);

            const veterinarianEntity = {
                identifier: uuidv4(),
                firstName: veterinarianInput.firstName,
                middleName: veterinarianInput.middleName,
                lastName: veterinarianInput.lastName,
                type: veterinarianInput.type,
                email: veterinarianInput.email,
                phone: veterinarianInput.phone,
                addressIdentifier: address.identifier,
            };

            try {
                const result = await this.getDBTutorialPetVeterinarianRepository().save(veterinarianEntity);

                veterinarian = await this.getVeterinarian(result.identifier, requestContext, context);

                this.logger.info(`${methodname} - Created veterinarian (${veterinarian.identifier}): ${this.logger.formatJSON(veterinarian)}`, requestContext);

                return veterinarian;
            } catch (error) {
                throw VeterinarianErrors.createVeterinarianFailed();
            }
        } else {
            throw VeterinarianErrors.veterinarianExists();
        }
    }

    async updateVeterinarian(identifier: string, veterinarianInput: VeterinarianInput, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${DBTutorialPetVeterinarianServiceImpl.name}.updateVeterinarian`;

        this.checkAuthorizationAdmin(requestContext);

        let veterinarian = await this.getVeterinarianForEdit(identifier, requestContext, context);

        if (veterinarianInput.address) {
            await this.getAddressService(requestContext).updateAddress(veterinarianInput.address.identifier, veterinarianInput.address, true, requestContext, context);
        }

        const veterinarianEntity = {
            firstName: veterinarianInput.firstName,
            middleName: veterinarianInput.middleName,
            lastName: veterinarianInput.lastName,
            type: veterinarianInput.type,
            email: veterinarianInput.email,
            phone: veterinarianInput.phone,
        };

        if (
            Object.values(veterinarianEntity).find((val) => {
                return val != undefined;
            })
        ) {
            const options: FindOptionsWhere<DBTutorialPetVeterinarianEntity> = { identifier: identifier };

            try {
                await this.getDBTutorialPetVeterinarianRepository().update(options, veterinarianEntity);
            } catch (error) {
                throw VeterinarianErrors.updateVeterinarianFailed();
            }
        }

        veterinarian = await this.getVeterinarian(identifier, requestContext, context);

        this.logger.info(`${methodname} - Updated veterinarian (${identifier}): ${this.logger.formatJSON(veterinarian)}`, requestContext);

        return veterinarian;
    }

    async deleteVeterinarian(identifier: string, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${DBTutorialPetVeterinarianServiceImpl.name}.deleteVeterinarian`;

        this.checkAuthorizationAdmin(requestContext);

        let veterinarian = await this.getVeterinarianForEdit(identifier, requestContext, context);

        try {
            await this.getDBTutorialPetVeterinarianRepository().delete({ identifier: identifier });
            await this.getAddressService(requestContext).deleteAddress(veterinarian.address.identifier, true, requestContext, context);
        } catch (error) {
            throw VeterinarianErrors.deleteVeterinarianFailed();
        }

        this.logger.info(`${methodname} - Deleted veterinarian (${identifier}): ${this.logger.formatJSON(veterinarian)}`, requestContext);

        return veterinarian;
    }

    protected async fetchVeterinarian(requestContext: RequestContext, identifier: string, whereClause: any = {}) {
        return await this.getDBTutorialPetVeterinarianRepository().findOne({
            where: {
                identifier: identifier,
                ...whereClause,
            },
            relations: {
                address: true,
            },
        });
    }

    private async getVeterinarianForEdit(identifier: string, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${DBTutorialPetVeterinarianServiceImpl.name}.getVeterinarianForEdit`;

        const result = await this.fetchVeterinarian(requestContext, identifier);

        if (result && !result.canEdit) {
            throw VeterinarianErrors.veterinarianNotEditable();
        }

        return this.getVeterinarianMapper(requestContext).mapVeterinarian(requestContext, result);
    }

    protected getVeterinarianMapper(requestContext: RequestContext) {
        return this.getMapper<DBTutorialPetVeterinarianMapper>(requestContext);
    }

    protected getAddressService(requestContext: RequestContext) {
        return this.getService<AddressService>(requestContext, AddressService);
    }

    protected getDBTutorialPetVeterinarianRepository(): Repository<DBTutorialPetVeterinarianEntity> {
        return this.getRepository<Repository<DBTutorialPetVeterinarianEntity>>(DBTutorialPetVeterinarianEntity);
    }
}
