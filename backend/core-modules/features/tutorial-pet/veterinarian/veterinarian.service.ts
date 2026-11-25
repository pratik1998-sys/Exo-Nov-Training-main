
import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';
import { BaseFeatureService } from '@feature/service';
import { VeterinarianResultSet, Veterinarian, VeterinarianInput, VeterinarianFilterInput } from './veterinarian.model';

export abstract class VeterinarianService extends BaseFeatureService {
    abstract getVeterinarians(filter: VeterinarianFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<VeterinarianResultSet>;
    abstract getVeterinarian(identifier: string, requestContext: RequestContext, context?: any): Promise<Veterinarian>;
    abstract createVeterinarian(veterinarianInput: VeterinarianInput, requestContext: RequestContext, context?: any): Promise<Veterinarian>;
    abstract updateVeterinarian(identifier: string, contactInput: VeterinarianInput, requestContext: RequestContext, context?: any): Promise<Veterinarian>;
    abstract deleteVeterinarian(identifier: string, requestContext: RequestContext, context?: any): Promise<Veterinarian>;
}
