import { RequestContext } from '@context/request';
import { PaginationInput } from '@feature/models';
import { PetFilterInput, PetResultSet, Pet, PetInput } from '@feature-tutorial-pet/pet/pet.model';
import { PetService } from '@feature-tutorial-pet/pet/pet.service';
import { TutorialPetGraphqlBaseServiceImpl } from '@plugin-tutorial-pet-graphql/common/tutorial-pet-graphql.base.service';


export class TutorialPetGraphqlPetServiceImpl extends TutorialPetGraphqlBaseServiceImpl implements PetService {
    async getPets(filter: PetFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<PetResultSet> {
        const methodname = `${TutorialPetGraphqlPetServiceImpl.name}.getPets`;

        throw new Error('Method not implemented.');
    }

    async getPet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetGraphqlPetServiceImpl.name}.getPets`;

        throw new Error('Method not implemented.');
    }

    async createPet(petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetGraphqlPetServiceImpl.name}.createPet`;

        throw new Error('Method not implemented.');
    }

    async updatePet(identifier: string, petInput: PetInput, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetGraphqlPetServiceImpl.name}.updatePet`;

        throw new Error('Method not implemented.');
    }

    async deletePet(identifier: string, requestContext: RequestContext, context?: any): Promise<Pet> {
        const methodname = `${TutorialPetGraphqlPetServiceImpl.name}.deletePet`;

        throw new Error('Method not implemented.');
    }
}
