import { Pet, PetFilterInput, PetInput, PetResultSet } from './pet.model';
import { PetRequestParameters } from './pet.parameters';
import { PetApiConfiguration } from './pet.api.configuration';
import { Context } from '@nestjs/graphql';
import { PetService } from './pet.service';
import { PetModule } from './pet.module';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';

const feature = PetModule.feature;

@Resolver((of) => Pet, { feature })
export class PetResolver extends BaseFeatureResolver {
    @Query(() => PetResultSet, PetApiConfiguration.pets().queryOptions, feature)
    async pets(
        @Args({ parameter: PetRequestParameters.filter, type: () => PetFilterInput, required: false })
        filter: PetFilterInput,
        @Args({ parameter: PetRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<PetResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(context, PetService);

        return await service.getPets(filter, pagination, requestContext, context);
    }

    @Query(() => Pet, PetApiConfiguration.pet().queryOptions, feature)
    async pet(
        @Args({ parameter: PetRequestParameters.identifier, required: true })
        identifier: string,
        @Context()
        context: any,
    ): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(context, PetService);

        return await service.getPet(identifier, requestContext, context);
    }
    @Mutation(() => Pet, PetApiConfiguration.petCreate().mutationOptions, feature)
    async petCreate(
        @Args({ parameter: PetRequestParameters.pet, type: () => PetInput, required: true })
        petInput: PetInput,
        @Context()
        context: any,
    ): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(context, PetService);

        return await service.createPet(petInput, requestContext, context);
    }
    @Mutation(() => Pet, PetApiConfiguration.petUpdate().mutationOptions, feature)
    async petUpdate(
        @Args({ parameter: PetRequestParameters.identifier, required: true })
        identifier: string,
        @Args({ parameter: PetRequestParameters.pet, type: () => PetInput, required: true })
        petInput: PetInput,
        @Context()
        context: any,
    ): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(context, PetService);

        return await service.updatePet(identifier, petInput, requestContext, context);
    }
    @Mutation(() => Pet, PetApiConfiguration.petDelete().mutationOptions, feature)
    async petDelete(
        @Args({ parameter: PetRequestParameters.identifier, required: true })
        identifier: string,
        @Context()
        context: any,
    ): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(context, PetService);

        return await service.deletePet(identifier, requestContext, context);
    }
}
