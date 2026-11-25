
import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';
import { BaseFeatureService } from '@feature/service';
import { PharmacyResultSet, Pharmacy, PharmacyInput, PharmacyFilterInput } from './pharmacy.model';

export abstract class PharmacyService extends BaseFeatureService {
    abstract getPharmacies(filterInput: PharmacyFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PharmacyResultSet>;
    abstract getPharmacy(identifier: string, requestContext: RequestContext, context?: any): Promise<Pharmacy>;
    abstract createPharmacy(pharmacyInput: PharmacyInput, requestContext: RequestContext, context?: any): Promise<Pharmacy>;
    abstract updatePharmacy(identifier: string, pharmacyInput: PharmacyInput, requestContext: RequestContext, context?: any): Promise<Pharmacy>;
    abstract deletePharmacy(identifier: string, requestContext: RequestContext, context?: any): Promise<Pharmacy>;
}
