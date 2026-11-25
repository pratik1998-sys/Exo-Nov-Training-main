import { FindManyOptions, FindOneOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { DBTutorialPetPrescriptionEntity } from './entities/tutorial-pet-db.prescription.entity';
import { RequestContext } from '@context/request';
import { StringUtility } from '@utilities';
import { DBTutorialPetPrescriptionMapper } from './tutorial-pet-db.prescription.mapper';
import { PaginationInput } from '@feature/models';
import { PetService } from '@feature-tutorial-pet/pet/pet.service';
import { PrescriptionFilterInput, PrescriptionResultSet, Prescription, PrescriptionInput } from '@feature-tutorial-pet/prescription/prescription.model';
import { PrescriptionService } from '@feature-tutorial-pet/prescription/prescription.service';
import { DBTutorialPetBaseServiceImpl } from '@plugin-tutorial-pet-db/common/db-tutorial-pet.base.service';
import { PrescriptionErrors } from '@feature-tutorial-pet/prescription/prescription.error';

export class DBTutorialPetPrescriptionServiceImpl extends DBTutorialPetBaseServiceImpl implements PrescriptionService {
    async getPrescriptions(filter: PrescriptionFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PrescriptionResultSet> {
        const methodname = `${DBTutorialPetPrescriptionServiceImpl.name}.getPrescriptions`;

        const { limit, offset } = this.translateLimitOffsetPagination(requestContext, pagination);

        let results = [];
        let total = 0;

        if (StringUtility.isStringNotEmpty(requestContext.user?.email)) {
            const prescriptionOptions: FindManyOptions<DBTutorialPetPrescriptionEntity> = {
                where: [],
                relations: {
                    veterinarian: true,
                    pharmacy: true,
                    pet: true,
                },
                skip: offset,
                take: limit,
                order: {
                    id: 'DESC',
                },
            };

            const options = [];

            if (this.isVeterinarian(requestContext)) {
                options.push({
                    veterinarianIdentifier: this.isVeterinarian(requestContext) ? requestContext.user?.identifier : undefined,
                    status: filter?.status ? In(filter.status) : undefined,
                    identifier: filter?.identifiers ? In(filter.identifiers) : undefined,
                });
            } else if (!this.isAdmin(requestContext)) {
                const petIdentifiers = await this.getPetIdentifiers(requestContext);

                options.push({
                    petIdentifier: In(petIdentifiers),
                    status: filter?.status ? In(filter.status) : undefined,
                    identifier: filter?.identifiers ? In(filter.identifiers) : undefined,
                });
            }

            prescriptionOptions.where = options;

            const [entities, count] = await this.getDBTutorialPetPrescriptionRepository().findAndCount(prescriptionOptions);

            results = entities;
            total = count;

            this.logger.info(`${methodname} - Prescriptions: ${this.logger.formatJSON(entities)}`, requestContext);
        }

        const prescriptionResultSet = this.getMapper<DBTutorialPetPrescriptionMapper>(requestContext).mapPrescriptionResultSet(requestContext, results, total, limit, offset);

        return prescriptionResultSet;
    }

    async getPrescription(identifier: string, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${DBTutorialPetPrescriptionServiceImpl.name}.getPrescription`;

        const prescriptionOptions: FindOneOptions<DBTutorialPetPrescriptionEntity> = {
            where: [],
            relations: {
                veterinarian: true,
                pharmacy: true,
                pet: true,
            },
        };

        const options = [];

        if (this.isVeterinarian(requestContext)) {
            options.push({
                veterinarianIdentifier: requestContext.user?.identifier,
                identifier,
            });
        } else if (!this.isAdmin(requestContext)) {
            const petIdentifiers = await this.getPetIdentifiers(requestContext);

            options.push({
                petIdentifier: In(petIdentifiers),
                identifier,
            });
        }

        const dbPrescription = await this.getDBTutorialPetPrescriptionRepository().findOne(prescriptionOptions);

        if (dbPrescription) {
            const prescription = this.getMapper<DBTutorialPetPrescriptionMapper>(requestContext).mapPrescription(requestContext, dbPrescription);

            return prescription;
        } else {
            throw PrescriptionErrors.getPrescriptionFailed();
        }
    }

    async createPrescription(prescriptionInput: PrescriptionInput, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${DBTutorialPetPrescriptionServiceImpl.name}.createPrescription`;

        this.checkPrescriptionActionAuthorization(requestContext);

        const isVet = this.isVeterinarian(requestContext);

        if (isVet) {
            prescriptionInput.veterinarianIdentifier = requestContext.user?.identifier;
        }

        if (
            StringUtility.isStringEmpty(prescriptionInput.petIdentifier) ||
            StringUtility.isStringEmpty(prescriptionInput.veterinarianIdentifier) ||
            StringUtility.isStringEmpty(prescriptionInput.pharmacyIdentifier)
        ) {
            throw PrescriptionErrors.prescriptionCreateMissingField();
        }

        prescriptionInput.veterinarianIdentifier = prescriptionInput.veterinarianIdentifier ?? requestContext.user?.identifier;

        if (this.isVeterinarian(requestContext) && prescriptionInput.veterinarianIdentifier != requestContext.user?.identifier) {
            throw PrescriptionErrors.notAuthorized();
        }

        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 14);
        const referenceNumber = timestamp.slice(-2) + random;

        const prescriptionEntity = {
            identifier: referenceNumber.toUpperCase(),
            type: prescriptionInput.type,
            description: prescriptionInput.description || '',
            prescription: prescriptionInput.prescription || '',
            veterinarianIdentifier: prescriptionInput.veterinarianIdentifier,
            pharmacyIdentifier: prescriptionInput.pharmacyIdentifier || requestContext.user?.email,
            petIdentifier: prescriptionInput.petIdentifier || requestContext.user?.email,
            status: prescriptionInput.status ?? 'PENDING',
            refillCount: prescriptionInput.refillCount,
        };

        try {
            const result = await this.getDBTutorialPetPrescriptionRepository().save(prescriptionEntity);

            const prescription = await this.getPrescription(result.identifier, requestContext, context);

            this.logger.info(`${methodname} - Created prescription (${prescription.identifier}): ${this.logger.formatJSON(prescription)}`, requestContext);

            return prescription;
        } catch (error) {
            throw PrescriptionErrors.createPrescriptionFailed();
        }
    }

    async updatePrescription(identifier: string, prescriptionInput: PrescriptionInput, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${DBTutorialPetPrescriptionServiceImpl.name}.updatePrescription`;

        this.checkPrescriptionActionAuthorization(requestContext);

        const prescriptionEntity = {
            type: prescriptionInput.type,
            veterinarianIdentifier: prescriptionInput.veterinarianIdentifier,
            pharmacyIdentifier: prescriptionInput.pharmacyIdentifier,
            petIdentifier: prescriptionInput.petIdentifier,
            status: prescriptionInput.status,
            refillCount: prescriptionInput.refillCount,
        };

        if (
            Object.values(prescriptionEntity).find((val) => {
                return val != undefined;
            })
        ) {
            const options: FindOptionsWhere<DBTutorialPetPrescriptionEntity> = { identifier: identifier };

            try {
                await this.getDBTutorialPetPrescriptionRepository().update(options, prescriptionEntity);
            } catch (error) {
                throw PrescriptionErrors.updatePrescriptionFailed();
            }
        }

        const prescription = await this.getPrescription(identifier, requestContext, context);

        this.logger.info(`${methodname} - Updated prescription (${identifier}): ${this.logger.formatJSON(prescription)}`, requestContext);

        return prescription;
    }

    async deletePrescription(identifier: string, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${DBTutorialPetPrescriptionServiceImpl.name}.deletePrescription`;

        this.checkPrescriptionActionAuthorization(requestContext);

        let prescription = await this.getPrescriptionForEdit(identifier, requestContext, context);

        try {
            await this.getDBTutorialPetPrescriptionRepository().delete({ identifier: identifier });
        } catch (error) {
            throw PrescriptionErrors.deletePrescriptionFailed();
        }

        this.logger.info(`${methodname} - Deleted prescription (${identifier}): ${this.logger.formatJSON(prescription)}`, requestContext);

        return prescription;
    }

    protected async fetchPrescription(requestContext: RequestContext, identifier: string, whereClause: any = {}) {
        const options = [];

        if (this.isVeterinarian(requestContext)) {
            options.push({
                veterinarianIdentifier: requestContext.user?.email,
                identifier,
                ...whereClause,
            });
        } else if (!this.isAdmin(requestContext)) {
            const petIdentifiers = await this.getPetIdentifiers(requestContext);

            options.push({
                petIdentifier: In(petIdentifiers),
                identifier,
                ...whereClause,
            });
        }

        return await this.getDBTutorialPetPrescriptionRepository().findOne({
            where: options,
            relations: {
                veterinarian: true,
                pharmacy: true,
                pet: true,
            },
        });
    }

    protected async getPets(requestContext: RequestContext) {
        const petResultSet = await this.getService<PetService>(requestContext, PetService).getPets(null, { pageSize: 100 }, requestContext);

        return petResultSet.results;
    }

    protected async getPetIdentifiers(requestContext: RequestContext) {
        let petIdentifiers: string[] = [];

        if (StringUtility.isStringNotEmpty(requestContext.user?.email)) {
            const pets = await this.getPets(requestContext);

            petIdentifiers = pets.map((pet) => pet.identifier);
        }

        return petIdentifiers;
    }

    private async getPrescriptionForEdit(identifier: string, requestContext: RequestContext, context?: any): Promise<Prescription> {
        const methodname = `${DBTutorialPetPrescriptionServiceImpl.name}.getPrescriptionForEdit`;

        const result = await this.fetchPrescription(requestContext, identifier, { canEdit: true });

        if (result && !result.canEdit) {
            throw PrescriptionErrors.prescriptionNotEditable();
        }

        return this.getMapper<DBTutorialPetPrescriptionMapper>(requestContext).mapPrescription(requestContext, result);
    }

    protected getDBTutorialPetPrescriptionRepository(): Repository<DBTutorialPetPrescriptionEntity> {
        return this.getRepository<Repository<DBTutorialPetPrescriptionEntity>>(DBTutorialPetPrescriptionEntity);
    }

    protected checkPrescriptionActionAuthorization(requestContext: RequestContext) {
        if (!this.isAdmin(requestContext) && !this.isVeterinarian(requestContext)) {
            throw PrescriptionErrors.notAuthorized();
        }
    }
}
