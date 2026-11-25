import { Context } from '@nestjs/graphql';
import { VeterinarianResultSet, Veterinarian, VeterinarianInput, VeterinarianFilterInput } from './veterinarian.model';
import { VeterinarianService } from './veterinarian.service';
import { VeterinarianRequestParameters } from './veterinarian.parameters';
import { VeterinarianModule } from './veterinarian.module';
import { VeterinarianApiConfiguration } from './veterinarian.api.configuration';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { PaginationInput } from '@feature/models';
import { BaseFeatureResolver } from '@feature/resolver';

const feature = VeterinarianModule.feature;

@Resolver((of) => Veterinarian, { feature })
export class VeterinarianResolver extends BaseFeatureResolver {
    @Query(() => VeterinarianResultSet, VeterinarianApiConfiguration.veterinarians().queryOptions, feature)
    async veterinarians(
        @Args({ parameter: VeterinarianRequestParameters.filter, type: () => VeterinarianFilterInput, required: false })
        filter: VeterinarianFilterInput,
        @Args({ parameter: VeterinarianRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<VeterinarianResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(context, VeterinarianService);

        return await service.getVeterinarians(filter, pagination, requestContext, context);
    }

    @Query(() => Veterinarian, VeterinarianApiConfiguration.veterinarian().queryOptions, feature)
    async veterinarian(
        @Args({ parameter: VeterinarianRequestParameters.identifier, required: true })
        identifier: string,
        @Context()
        context: any,
    ): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(context, VeterinarianService);
        return await service.getVeterinarian(identifier, requestContext, context);
    }

    @Mutation(() => Veterinarian, VeterinarianApiConfiguration.veterinarianCreate().mutationOptions, feature)
    async veterinarianCreate(
        @Args({ parameter: VeterinarianRequestParameters.veterinarian, type: () => VeterinarianInput, required: true })
        veterinarian: VeterinarianInput,
        @Context()
        context: any,
    ): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(context, VeterinarianService);

        return await service.createVeterinarian(veterinarian, requestContext, context);
    }

    @Mutation(() => Veterinarian, VeterinarianApiConfiguration.veterinarianUpdate().mutationOptions, feature)
    async veterinarianUpdate(
        @Args({ parameter: VeterinarianRequestParameters.identifier, required: true })
        identifier: string,
        @Args({ parameter: VeterinarianRequestParameters.veterinarian, type: () => VeterinarianInput, required: true })
        veterinarian: VeterinarianInput,
        @Context()
        context: any,
    ): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(context, VeterinarianService);

        return await service.updateVeterinarian(identifier, veterinarian, requestContext, context);
    }

    @Mutation(() => Veterinarian, VeterinarianApiConfiguration.veterinarianDelete().mutationOptions, feature)
    async veterinarianDelete(
        @Args({ parameter: VeterinarianRequestParameters.identifier, required: true })
        identifier: string,
        @Context()
        context: any,
    ): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(context, VeterinarianService);

        return await service.deleteVeterinarian(identifier, requestContext, context);
    }
}
