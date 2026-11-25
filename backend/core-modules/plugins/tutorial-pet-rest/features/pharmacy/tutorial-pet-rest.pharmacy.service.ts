import { RequestContext } from '@context/request';
import { TutorialPetRestPharmacyMapper } from './tutorial-pet-rest.pharmacy.mapper';
import {
    TutorialPetRestPharmacyQuery,
    TutorialPetRestPharmacyResultSet,
    TutorialPetRestPharmacy,
    TutorialPetRestPharmacyBodyCreate,
    TutorialPetRestPharmacyBodyUpdate,
    TutorialPetRestPharmacyBodyBase,
} from './schema/tutorial-pet-rest.pharmacy.schema';
import { TutorialPetRestPharmacyDatasource } from './tutorial-pet-rest.pharmacy.datasource';
import { TutorialPetRestBaseServiceImpl } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.service';
import { PaginationInput } from '@feature/models';
import { PharmacyFilterInput, PharmacyResultSet, Pharmacy, PharmacyInput } from '@feature-tutorial-pet/pharmacy/pharmacy.model';
import { PharmacyService } from '@feature-tutorial-pet/pharmacy/pharmacy.service';
import { TutorialPetRestConsumerConfiguration } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.configuration.type';
import { PharmacyErrors } from '@feature-tutorial-pet/pharmacy/pharmacy.error';

export class TutorialPetRestPharmacyServiceImpl extends TutorialPetRestBaseServiceImpl implements PharmacyService {
    async getPharmacies(filter: PharmacyFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PharmacyResultSet> {
        const methodname = `${TutorialPetRestPharmacyServiceImpl.name}.getPharmacys`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        pagination = this.validatePagination(pagination, requestContext);

        const query: TutorialPetRestPharmacyQuery = this.composeQuery(requestContext, pagination, null);

        let dsResultSet: TutorialPetRestPharmacyResultSet;

        try {
            dsResultSet = await this.getPharmacyDatasource(requestContext).getPharmacies(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching pharmacies: ${this.logger.formatJSON(error)}`, requestContext);
            throw PharmacyErrors.getPharmaciesFailed();
        }

        return this.getPharmacyMapper(requestContext).mapPharmacyResultSet(requestContext, dsResultSet);
    }

    async getPharmacy(identifier: string, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${TutorialPetRestPharmacyServiceImpl.name}.getPharmacy`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        let dsResult: TutorialPetRestPharmacy;

        try {
            dsResult = await this.getPharmacyDatasource(requestContext).getPharmacy(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching pharmacy [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PharmacyErrors.getPharmacyFailed();
        }

        return this.getPharmacyMapper(requestContext).mapPharmacy(requestContext, dsResult);
    }

    async createPharmacy(pharmacyInput: PharmacyInput, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${TutorialPetRestPharmacyServiceImpl.name}.createPharmacy`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composePharmacyInputBaseBody(requestContext, pharmacyInput) as TutorialPetRestPharmacyBodyCreate;

        let dsResult: TutorialPetRestPharmacy;

        try {
            dsResult = await this.getPharmacyDatasource(requestContext).createPharmacy(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating pharmacy [${this.logger.formatJSON(pharmacyInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PharmacyErrors.createPharmacyFailed();
        }

        return this.getPharmacyMapper(requestContext).mapPharmacy(requestContext, dsResult);
    }

    async updatePharmacy(identifier: string, pharmacyInput: PharmacyInput, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${TutorialPetRestPharmacyServiceImpl.name}.updatePharmacy`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composePharmacyInputBaseBody(requestContext, pharmacyInput) as TutorialPetRestPharmacyBodyUpdate;

        let dsResult: TutorialPetRestPharmacy;

        try {
            dsResult = await this.getPharmacyDatasource(requestContext).updatePharmacy(requestContext, identifier, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating pharmacy [${identifier}] - [${this.logger.formatJSON(pharmacyInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PharmacyErrors.updatePharmacyFailed();
        }

        return this.getPharmacyMapper(requestContext).mapPharmacy(requestContext, dsResult);
    }

    async deletePharmacy(identifier: string, requestContext: RequestContext, context?: any): Promise<Pharmacy> {
        const methodname = `${TutorialPetRestPharmacyServiceImpl.name}.deletePharmacy`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        let dsResult: TutorialPetRestPharmacy;

        try {
            dsResult = await this.getPharmacyDatasource(requestContext).deletePharmacy(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting pharmacy [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PharmacyErrors.deletePharmacyFailed();
        }

        return this.getPharmacyMapper(requestContext).mapPharmacy(requestContext, dsResult);
    }

    protected composePharmacyInputBaseBody(requestContext: RequestContext, pharmacyInput: PharmacyInput): TutorialPetRestPharmacyBodyBase {
        const body: TutorialPetRestPharmacyBodyBase = {
            name: pharmacyInput.name,
            description: pharmacyInput.description,
            phone: pharmacyInput.phone,
            email: pharmacyInput.email,
            address: {},
        };

        return body;
    }

    protected getPharmacyDatasource(requestContext: RequestContext) {
        return this.getDatasource<TutorialPetRestPharmacyDatasource>(requestContext, TutorialPetRestPharmacyDatasource);
    }

    protected getPharmacyMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestPharmacyMapper>(requestContext, TutorialPetRestPharmacyMapper);
    }
}
