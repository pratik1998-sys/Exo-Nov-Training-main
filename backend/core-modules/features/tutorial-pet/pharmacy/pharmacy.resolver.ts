import { Context } from '@nestjs/graphql';
import { PharmacyResultSet, Pharmacy, PharmacyInput, PharmacyFilterInput } from './pharmacy.model';
import { PharmacyService } from './pharmacy.service';
import { PharmacyRequestParameters } from './pharmacy.parameters';
import { PharmacyApiConfiguration } from './pharmacy.api.configuration';
import { PharmacyModule } from './pharmacy.module';
import { BaseFeatureResolver } from '@feature/resolver';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { PaginationInput } from '@feature/models';

const feature = PharmacyModule.feature;

@Resolver((of) => Pharmacy, { feature })
export class PharmacyResolver extends BaseFeatureResolver {
    @Query(() => PharmacyResultSet, PharmacyApiConfiguration.pharmacies().queryOptions, feature)
    async pharmacies(
        @Args({ parameter: PharmacyRequestParameters.filter, type: () => PharmacyFilterInput, required: false })
        filter: PharmacyFilterInput,
        @Args({ parameter: PharmacyRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<PharmacyResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(context, PharmacyService);

        return await service.getPharmacies(filter, pagination, requestContext, context);
    }

    @Query(() => Pharmacy, PharmacyApiConfiguration.pharmacy().queryOptions, feature)
    async pharmacy(
        @Args({ parameter: PharmacyRequestParameters.identifier, required: true })
        identifier: string,
        @Context()
        context: any,
    ): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(context, PharmacyService);

        return await service.getPharmacy(identifier, requestContext, context);
    }

    @Mutation(() => Pharmacy, PharmacyApiConfiguration.pharmacyCreate().mutationOptions, feature)
    async pharmacyCreate(
        @Args({ parameter: PharmacyRequestParameters.pharmacy, type: () => PharmacyInput, required: true })
        pharmacyInput: PharmacyInput,
        @Context()
        context: any,
    ): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(context, PharmacyService);

        return await service.createPharmacy(pharmacyInput, requestContext, context);
    }

    @Mutation(() => Pharmacy, PharmacyApiConfiguration.pharmacyUpdate().mutationOptions, feature)
    async pharmacyUpdate(
        @Args({ parameter: PharmacyRequestParameters.identifier, required: true })
        identifier: string,
        @Args({ parameter: PharmacyRequestParameters.pharmacy, type: () => PharmacyInput, required: true })
        pharmacyInput: PharmacyInput,
        @Context()
        context: any,
    ): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(context, PharmacyService);

        return await service.updatePharmacy(identifier, pharmacyInput, requestContext, context);
    }

    @Mutation(() => Pharmacy, PharmacyApiConfiguration.pharmacyDelete().mutationOptions, feature)
    async pharmacyDelete(
        @Args({ parameter: PharmacyRequestParameters.identifier, required: true })
        identifier: string,
        @Context()
        context: any,
    ): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(context, PharmacyService);

        return await service.deletePharmacy(identifier, requestContext, context);
    }
}
