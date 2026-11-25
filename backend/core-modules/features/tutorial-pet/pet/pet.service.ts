
import { BaseFeatureService } from '@feature/service';
import { Pet, PetFilterInput, PetInput, PetResultSet } from './pet.model';
import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';

export abstract class PetService extends BaseFeatureService {
    abstract getPets(filter: PetFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PetResultSet>;
    abstract getPet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet>;
    abstract createPet(petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet>;
    abstract updatePet(identifier: string, petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet>;
    abstract deletePet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet>;
}
