import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { DBTutorialPetPetEntity } from './entities/tutorial-pet-db.pet.entity';
import { RequestContext } from '@context/request';
import { StringUtility } from '@utilities';
import { v4 as uuidv4 } from 'uuid';
import { DBTutorialPetPetMapper } from './tutorial-pet-db.pet.mapper';
import { PaginationInput } from '@feature/models';
import { PetService } from '@feature-tutorial-pet/pet/pet.service';
import { DBTutorialPetBaseServiceImpl } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.service';
import { PetFilterInput, PetResultSet, Pet, PetInput } from '@feature-tutorial-pet/pet/pet.model';
import { PetErrors } from '@feature-tutorial-pet/pet/pet.error';

export class DBTutorialPetPetServiceImpl extends DBTutorialPetBaseServiceImpl implements PetService {
    async getPets(filter: PetFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PetResultSet> {
        const methodname = `${DBTutorialPetPetServiceImpl.name}.getPets`;

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        let results = [];
        let total = 0;

        if (StringUtility.isStringNotEmpty(requestContext.user?.email)) {
            const petOptions: FindManyOptions<DBTutorialPetPetEntity> = {
                where: {
                    userIdentifier: !this.isAdmin(requestContext) ? requestContext.user.identifier : (filter.userIdentifier ?? undefined),
                    identifier: filter?.identifiers ? In(filter.identifiers) : undefined,
                    firstName: filter?.firstName,
                },
                skip: offset,
                take: limit,
            };

            const [entities, count] = await this.getDBTutorialPetPetRepository().findAndCount(petOptions);

            results = entities;
            total = count;

            this.logger.info(`${methodname} - Pets: ${this.logger.formatJSON(entities)}`, requestContext);
        }

        return this.getPetMapper(requestContext).mapPetResultSet(requestContext, results, total, limit, offset);
    }

    async getPet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${DBTutorialPetPetServiceImpl.name}.getPet`;

        const petResultSet = await this.getPets({ identifiers: [identifier] }, null, requestContext, context);

        if (petResultSet.results.length > 0) {
            return petResultSet.results[0];
        } else {
            throw PetErrors.getPetFailed();
        }
    }

    async createPet(petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${DBTutorialPetPetServiceImpl.name}.createPet`;

        let pet = null;

        if (StringUtility.isStringNotEmpty(petInput.userIdentifier) && !this.isAdmin(requestContext)) {
            throw PetErrors.notAuthorized();
        }

        try {
            const petResultSet = await this.getPets({ firstName: petInput.firstName }, null, requestContext, context);

            pet = petResultSet?.results?.[0];
        } catch (error) { }

        if (pet == null) {
            const petEntity: DBTutorialPetPetEntity = {
                id: undefined,
                identifier: uuidv4(),
                firstName: petInput.firstName,
                middleName: petInput.middleName,
                lastName: petInput.lastName,
                type: petInput.type,
                breed: petInput.breed,
                height: petInput.height,
                weight: petInput.weight,
                userIdentifier: requestContext.user?.identifier,
                thumbnail: petInput.thumbnail,
                canEdit: true,
            };

            try {
                const result = await this.getDBTutorialPetPetRepository().save(petEntity);

                pet = await this.getPet(result.identifier, requestContext, context);

                this.logger.info(`${methodname} - Created pet (${pet.identifier}): ${this.logger.formatJSON(pet)}`, requestContext);

                return pet;
            } catch (error) {
                throw PetErrors.createPetFailed();
            }
        } else {
            throw PetErrors.petExists();
        }
    }

    async updatePet(identifier: string, petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${DBTutorialPetPetServiceImpl.name}.updatePet`;

        const dsPet = await this.getPetForEdit(identifier, requestContext, context);

        const petEntity: DBTutorialPetPetEntity = {
            firstName: petInput.firstName,
            middleName: petInput.middleName,
            lastName: petInput.lastName,
            type: petInput.type,
            height: petInput.height,
            weight: petInput.weight,
            breed: petInput.breed,
            thumbnail: petInput.thumbnail,
        };

        if (
            Object.values(petEntity).find((val) => {
                return val != undefined;
            })
        ) {
            const options: FindOptionsWhere<DBTutorialPetPetEntity> = { identifier: identifier };

            try {
                await this.getDBTutorialPetPetRepository().update(options, petEntity);
            } catch (error) {
                throw PetErrors.updatePetFailed();
            }
        }

        const pet = await this.getPet(identifier, requestContext, context);

        this.logger.info(`${methodname} - Updated pet (${identifier}): ${this.logger.formatJSON(pet)}`, requestContext);

        return pet;
    }

    async deletePet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${DBTutorialPetPetServiceImpl.name}.deletePet`;

        const dsPet = await this.getPetForEdit(identifier, requestContext, context);

        const pet = this.getPetMapper(requestContext).mapPet(requestContext, dsPet);

        try {
            await this.getDBTutorialPetPetRepository().delete({ identifier: identifier });
        } catch (error) {
            throw PetErrors.deletePetFailed();
        }

        this.logger.info(`${methodname} - Deleted pet (${identifier}): ${this.logger.formatJSON(pet)}`, requestContext);

        return pet;
    }

    protected async fetchPet(requestContext: RequestContext, identifier: string, whereClause: any = {}) {
        return await this.getDBTutorialPetPetRepository().findOne({
            where: {
                identifier: identifier,
                userIdentifier: !this.isAdmin(requestContext) ? requestContext.user?.identifier : undefined,
                ...whereClause,
            },
        });
    }

    private async getPetForEdit(identifier: string, requestContext: RequestContext, context?: any): Promise<DBTutorialPetPetEntity> {
        const methodname = `${DBTutorialPetPetServiceImpl.name}.getContactForEdit`;

        const result = await this.fetchPet(requestContext, identifier);

        if (result && !result.canEdit) {
            throw PetErrors.petNotEditable();
        }

        return result;
    }

    protected getPetMapper(requestContext: RequestContext) {
        return this.getMapper<DBTutorialPetPetMapper>(requestContext, DBTutorialPetPetMapper);
    }

    protected getDBTutorialPetPetRepository(): Repository<DBTutorialPetPetEntity> {
        return this.getRepository<Repository<DBTutorialPetPetEntity>>(DBTutorialPetPetEntity);
    }
}
