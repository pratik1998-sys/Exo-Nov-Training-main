
import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';
import { BaseFeatureService } from '@feature/service';
import { Prescription, PrescriptionFilterInput, PrescriptionInput, PrescriptionResultSet } from './prescription.model';

export abstract class PrescriptionService extends BaseFeatureService {
    abstract getPrescriptions(filter: PrescriptionFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PrescriptionResultSet>;
    abstract getPrescription(identifier: string, requestContext: RequestContext, context?: any): Promise<Prescription>;
    abstract createPrescription(prescriptionInput: PrescriptionInput, requestContext: RequestContext, context?: any): Promise<Prescription>;
    abstract updatePrescription(identifier: string, prescriptionInput: PrescriptionInput, requestContext: RequestContext, context?: any): Promise<Prescription>;
    abstract deletePrescription(identifier: string, requestContext: RequestContext, context?: any): Promise<Prescription>;
}
