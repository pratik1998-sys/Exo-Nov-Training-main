import { RequestContext } from '@context/request';
import { TutorialPetRestPrescriptionDatasource } from './tutorial-pet-rest.prescription.datasource';
import { TutorialPetRestPrescriptionMapper } from './tutorial-pet-rest.prescription.mapper';
import {
    TutorialPetRestPrescriptionQuery,
    TutorialPetRestPrescriptionResultSet,
    TutorialPetRestPrescription,
    TutorialPetRestPrescriptionBodyCreate,
    TutorialPetRestPrescriptionBodyUpdate,
    TutorialPetRestPrescriptionBodyBase,
} from './schema/tutorial-pet-rest.prescription.schema';
import { TutorialPetRestBaseServiceImpl } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.base.service';
import { PaginationInput } from '@feature/models';
import { PrescriptionFilterInput, PrescriptionResultSet, Prescription, PrescriptionInput } from '@feature-tutorial-pet/prescription/prescription.model';
import { PrescriptionService } from '@feature-tutorial-pet/prescription/prescription.service';
import { TutorialPetRestConsumerConfiguration } from '@plugin-tutorial-pet-rest/common/tutorial-pet-rest.configuration.type';
import { PrescriptionErrors } from '@feature-tutorial-pet/prescription/prescription.error';

export class TutorialPetRestPrescriptionServiceImpl extends TutorialPetRestBaseServiceImpl implements PrescriptionService {
    async getPrescriptions(filter: PrescriptionFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PrescriptionResultSet> {
        const methodname = `${TutorialPetRestPrescriptionServiceImpl.name}.getPrescriptions`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        pagination = this.validatePagination(pagination, requestContext);

        const query: TutorialPetRestPrescriptionQuery = this.composeQuery(requestContext, pagination, null);

        let dsResultSet: TutorialPetRestPrescriptionResultSet;

        try {
            dsResultSet = await this.getPrescriptionDatasource(requestContext).getPrescriptions(requestContext, query);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching prescriptions: ${this.logger.formatJSON(error)}`, requestContext);
            throw PrescriptionErrors.getPrescriptionsFailed();
        }

        return this.getPrescriptionMapper(requestContext).mapPrescriptionResultSet(requestContext, dsResultSet);
    }

    async getPrescription(identifier: string, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${TutorialPetRestPrescriptionServiceImpl.name}.getPrescription`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        let dsResult: TutorialPetRestPrescription;

        try {
            dsResult = await this.getPrescriptionDatasource(requestContext).getPrescription(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching prescription [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PrescriptionErrors.getPrescriptionFailed();
        }

        return this.getPrescriptionMapper(requestContext).mapPrescription(requestContext, dsResult);
    }

    async createPrescription(prescriptionInput: PrescriptionInput, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${TutorialPetRestPrescriptionServiceImpl.name}.createPrescription`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composePrescriptionInputBaseBody(requestContext, prescriptionInput) as TutorialPetRestPrescriptionBodyCreate;

        let dsResult: TutorialPetRestPrescription;

        try {
            dsResult = await this.getPrescriptionDatasource(requestContext).createPrescription(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error creating prescription [${this.logger.formatJSON(prescriptionInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PrescriptionErrors.createPrescriptionFailed();
        }

        return this.getPrescriptionMapper(requestContext).mapPrescription(requestContext, dsResult);
    }

    async updatePrescription(identifier: string, prescriptionInput: PrescriptionInput, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${TutorialPetRestPrescriptionServiceImpl.name}.updatePrescription`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        const body = this.composePrescriptionInputBaseBody(requestContext, prescriptionInput) as TutorialPetRestPrescriptionBodyUpdate;

        let dsResult: TutorialPetRestPrescription;

        try {
            dsResult = await this.getPrescriptionDatasource(requestContext).updatePrescription(requestContext, identifier, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating prescription [${identifier}] - [${this.logger.formatJSON(prescriptionInput, true)}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PrescriptionErrors.updatePrescriptionFailed();
        }

        return this.getPrescriptionMapper(requestContext).mapPrescription(requestContext, dsResult);
    }

    async deletePrescription(identifier: string, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${TutorialPetRestPrescriptionServiceImpl.name}.deletePrescription`;

        const { configuration } = this.getPluginConsumerConfiguration<TutorialPetRestConsumerConfiguration>(requestContext);
        this.logger.info(`Plugin Consumer Configuration: ${this.logger.formatJSON(configuration, true)}`, requestContext);

        let dsResult: TutorialPetRestPrescription;

        try {
            dsResult = await this.getPrescriptionDatasource(requestContext).deletePrescription(requestContext, identifier);
        } catch (error) {
            this.logger.info(`${methodname} - Error deleting prescription [${identifier}]: ${this.logger.formatJSON(error)}`, requestContext);
            throw PrescriptionErrors.deletePrescriptionFailed();
        }

        return this.getPrescriptionMapper(requestContext).mapPrescription(requestContext, dsResult);
    }

    protected composePrescriptionInputBaseBody(requestContext: RequestContext, prescriptionInput: PrescriptionInput): TutorialPetRestPrescriptionBodyBase {
        const body: TutorialPetRestPrescriptionBodyBase = {
            prescription: prescriptionInput.prescription,
            description: prescriptionInput.description,
            status: prescriptionInput.status,
            refillCount: prescriptionInput.refillCount,
            petIdentifier: prescriptionInput.petIdentifier,
            veterinarianIdentifier: prescriptionInput.veterinarianIdentifier,
            pharmacyIdentifier: prescriptionInput.pharmacyIdentifier,
        };

        return body;
    }

    protected getPrescriptionDatasource(requestContext: RequestContext) {
        return this.getDatasource<TutorialPetRestPrescriptionDatasource>(requestContext, TutorialPetRestPrescriptionDatasource);
    }

    protected getPrescriptionMapper(requestContext: RequestContext) {
        return this.getMapper<TutorialPetRestPrescriptionMapper>(requestContext, TutorialPetRestPrescriptionMapper);
    }
}
