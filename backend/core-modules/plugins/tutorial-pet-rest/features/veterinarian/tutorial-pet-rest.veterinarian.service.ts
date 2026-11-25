
import { RequestContext } from '@context/request';
import { TutorialPetRestVeterinarianDatasource } from './tutorial-pet-rest.veterinarian.datasource';
import { TutorialPetRestVeterinarianMapper } from './tutorial-pet-rest.veterinarian.mapper';
import {
    TutorialPetRestVeterinarianQuery,
    TutorialPetRestVeterinarianResultSet,
    TutorialPetRestVeterinarian,
    TutorialPetRestVeterinarianBodyCreate,
    TutorialPetRestVeterinarianBodyUpdate,
    TutorialPetRestVeterinarianBodyBase,
} from './schema/tutorial-pet-rest.veterinarian.schema';
import { PaginationInput } from '@feature/models';
import { VeterinarianFilterInput, VeterinarianResultSet, Veterinarian, VeterinarianInput } from '@feature-tutorial-pet/veterinarian/veterinarian.model';
import { VeterinarianService } from '@feature-tutorial-pet/veterinarian/veterinarian.service';
import { TutorialPetRestBaseServiceImpl } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.service';
import { TutorialPetRestConsumerConfiguration } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.configuration.type';
import { VeterinarianErrors } from '@feature-tutorial-pet/veterinarian/veterinarian.error';


export class TutorialPetRestVeterinarianServiceImpl extends TutorialPetRestBaseServiceImpl implements VeterinarianService {
    async getVeterinarians(filter: VeterinarianFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<VeterinarianResultSet> {
        const methodname = `${TutorialPetRestVeterinarianServiceImpl.name}.getVeterinarians`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        pagination = this.validatePagination(pagination, requestContext);

        const query: TutorialPetRestVeterinarianQuery = this.composeQuery(requestContext, pagination, null);

        query.identifiers = filter?.identifiers;

        let dsResultSet: TutorialPetRestVeterinarianResultSet;

        try {
            dsResultSet = await this.getVeterinarianDatasource(requestContext).getVeterinarians(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching veterinarians: ${this.logger.formatJSON(error)}`, requestContext);
            throw VeterinarianErrors.getVeterinariansFailed();
        }

        return this.getVeterinarianMapper(requestContext).mapVeterinarianResultSet(requestContext, dsResultSet);
    }

    async getVeterinarian(identifier: string, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${TutorialPetRestVeterinarianServiceImpl.name}.getVeterinarian`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        let dsResult: TutorialPetRestVeterinarian;

        try {
            dsResult = await this.getVeterinarianDatasource(requestContext).getVeterinarian(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching veterinarian [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw VeterinarianErrors.getVeterinarianFailed();
        }

        return this.getVeterinarianMapper(requestContext).mapVeterinarian(requestContext, dsResult);
    }

    async createVeterinarian(veterinarianInput: VeterinarianInput, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${TutorialPetRestVeterinarianServiceImpl.name}.createVeterinarian`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composeVeterinarianInputBaseBody(requestContext, veterinarianInput) as TutorialPetRestVeterinarianBodyCreate;

        let dsResult: TutorialPetRestVeterinarian;

        try {
            dsResult = await this.getVeterinarianDatasource(requestContext).createVeterinarian(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating veterinarian [${this.logger.formatJSON(veterinarianInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw VeterinarianErrors.createVeterinarianFailed();
        }

        return this.getVeterinarianMapper(requestContext).mapVeterinarian(requestContext, dsResult);
    }

    async updateVeterinarian(identifier: string, veterinarianInput: VeterinarianInput, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${TutorialPetRestVeterinarianServiceImpl.name}.updateVeterinarian`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composeVeterinarianInputBaseBody(requestContext, veterinarianInput) as TutorialPetRestVeterinarianBodyUpdate;

        let dsResult: TutorialPetRestVeterinarian;

        try {
            dsResult = await this.getVeterinarianDatasource(requestContext).updateVeterinarian(requestContext, identifier, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating veterinarian [${identifier}] - [${this.logger.formatJSON(veterinarianInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw VeterinarianErrors.updateVeterinarianFailed();
        }

        return this.getVeterinarianMapper(requestContext).mapVeterinarian(requestContext, dsResult);
    }

    async deleteVeterinarian(identifier: string, requestContext: RequestContext, context?: any): Promise<Veterinarian> {
        const methodname = `${TutorialPetRestVeterinarianServiceImpl.name}.deleteVeterinarian`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        let dsResult: TutorialPetRestVeterinarian;

        try {
            dsResult = await this.getVeterinarianDatasource(requestContext).deleteVeterinarian(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting veterinarian [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw VeterinarianErrors.deleteVeterinarianFailed();
        }

        return this.getVeterinarianMapper(requestContext).mapVeterinarian(requestContext, dsResult);
    }

    protected composeVeterinarianInputBaseBody(requestContext: RequestContext, veterinarianInput: VeterinarianInput): TutorialPetRestVeterinarianBodyBase {
        const body: TutorialPetRestVeterinarianBodyBase = {
            firstName: veterinarianInput.firstName,
            middleName: veterinarianInput.middleName,
            lastName: veterinarianInput.lastName,
            phone: veterinarianInput.phone,
            email: veterinarianInput.email,
            thumbnail: veterinarianInput.thumbnail,
            address: {},
        };

        return body;
    }

    protected getVeterinarianDatasource(requestContext: RequestContext) {
        return this.getDatasource<TutorialPetRestVeterinarianDatasource>(requestContext, TutorialPetRestVeterinarianDatasource);
    }

    protected getVeterinarianMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestVeterinarianMapper>(requestContext, TutorialPetRestVeterinarianMapper);
    }
}
