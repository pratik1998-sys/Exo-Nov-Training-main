import { RequestContext } from '@context/request';
import {
    TutorialPetRestPetQuery,
    TutorialPetRestPetResultSet,
    TutorialPetRestPet,
    TutorialPetRestPetBodyCreate,
    TutorialPetRestPetBodyUpdate,
    TutorialPetRestPetBodyBase,
} from './schema/tutorial-pet-rest.pet.schema';
import { TutorialPetRestPetDatasource } from './tutorial-pet-rest.pet.datasource';
import { TutorialPetRestPetMapper } from './tutorial-pet-rest.pet.mapper';
import { PaginationInput } from '@feature/models';
import { PetFilterInput, PetResultSet, Pet, PetInput } from '@feature-tutorial-pet/pet/pet.model';
import { PetService } from '@feature-tutorial-pet/pet/pet.service';
import { TutorialPetRestBaseServiceImpl } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.service';
import { TutorialPetRestConsumerConfiguration } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.configuration.type';
import { PetErrors } from '@feature-tutorial-pet/pet/pet.error';

export class TutorialPetRestPetServiceImpl extends TutorialPetRestBaseServiceImpl implements PetService {
    async getPets(filter: PetFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PetResultSet> {
        const methodname = `${TutorialPetRestPetServiceImpl.name}.getPets`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        pagination = this.validatePagination(pagination, requestContext);

        const query: TutorialPetRestPetQuery = this.composeQuery(requestContext, pagination, null);

        query.identifiers = filter?.identifiers;
        query.userIdentifier = filter?.userIdentifier;

        let dsResultSet: TutorialPetRestPetResultSet;

        try {
            dsResultSet = await this.getPetDatasource(requestContext).getPets(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching pets: ${this.logger.formatJSON(error)}`, requestContext);
            throw PetErrors.getPetsFailed();
        }

        return this.getPetMapper(requestContext).mapPetResultSet(requestContext, dsResultSet);
    }

    async getPet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetRestPetServiceImpl.name}.getPet`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        let dsResult: TutorialPetRestPet;

        try {
            dsResult = await this.getPetDatasource(requestContext).getPet(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching pet [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PetErrors.getPetFailed();
        }

        return this.getPetMapper(requestContext).mapPet(requestContext, dsResult);
    }

    async createPet(petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetRestPetServiceImpl.name}.createPet`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composePetInputBaseBody(requestContext, petInput) as TutorialPetRestPetBodyCreate;

        let dsResult: TutorialPetRestPet;

        try {
            dsResult = await this.getPetDatasource(requestContext).createPet(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating pet [${this.logger.formatJSON(petInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PetErrors.createPetFailed();
        }

        return this.getPetMapper(requestContext).mapPet(requestContext, dsResult);
    }

    async updatePet(identifier: string, petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetRestPetServiceImpl.name}.updatePet`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composePetInputBaseBody(requestContext, petInput) as TutorialPetRestPetBodyUpdate;

        let dsResult: TutorialPetRestPet;

        try {
            dsResult = await this.getPetDatasource(requestContext).updatePet(requestContext, identifier, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating pet [${identifier}] - [${this.logger.formatJSON(petInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PetErrors.updatePetFailed();
        }

        return this.getPetMapper(requestContext).mapPet(requestContext, dsResult);
    }

    async deletePet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetRestPetServiceImpl.name}.deletePet`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);

        let dsResult: TutorialPetRestPet;

        try {
            dsResult = await this.getPetDatasource(requestContext).deletePet(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting pet [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PetErrors.deletePetFailed();
        }

        return this.getPetMapper(requestContext).mapPet(requestContext, dsResult);
    }

    protected composePetInputBaseBody(requestContext: RequestContext, petInput: PetInput): TutorialPetRestPetBodyBase {
        const body: TutorialPetRestPetBodyBase = {
            firstName: petInput.firstName,
            middleName: petInput.middleName,
            lastName: petInput.lastName,
            breed: petInput.breed,
            height: petInput.height,
            weight: petInput.weight,
            thumbnail: petInput.thumbnail,
        };

        return body;
    }

    protected getPetDatasource(requestContext: RequestContext) {
        return this.getDatasource<TutorialPetRestPetDatasource>(requestContext, TutorialPetRestPetDatasource);
    }

    protected getPetMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestPetMapper>(requestContext, TutorialPetRestPetMapper);
    }
}
