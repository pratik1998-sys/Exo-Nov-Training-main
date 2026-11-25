import { Context } from '@nestjs/graphql';
import { Country, CountryResultSet, RegionApiConfiguration, RegionModule, RegionRequestParameters, RegionService, State, StateResultSet } from '@feature-region';
import { Args, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PaginationInput } from '@feature/models';

const feature = RegionModule.feature;

@Resolver((of) => Country, { feature })
export class RegionResolver extends BaseFeatureResolver {
    @Query(() => CountryResultSet, RegionApiConfiguration.countries().queryOptions, feature)
    async regionCountries(
        @Args({ parameter: RegionRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<CountryResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(context, RegionService);

        return await service.getCountries(pagination, requestContext, context);
    }

    @Query(() => Country, RegionApiConfiguration.country().queryOptions, feature)
    async regionCountry(
        @Args({ parameter: RegionRequestParameters.id, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<Country> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(context, RegionService);

        return await service.getCountry(id, requestContext, context);
    }

    @Query(() => StateResultSet, RegionApiConfiguration.countryStates().queryOptions, feature)
    async regionStates(
        @Args({ parameter: RegionRequestParameters.countryIdentifier, required: true })
        countryIdentifier: string,
        @Args({ parameter: RegionRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<StateResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(context, RegionService);

        return await service.getCountryStates(countryIdentifier, pagination, requestContext, context);
    }

    @Query(() => State, RegionApiConfiguration.countryState().queryOptions)
    async regionState(
        @Args({ parameter: RegionRequestParameters.countryIdentifier, required: true })
        countryIdentifier: string,
        @Args({ parameter: RegionRequestParameters.stateIdentifier, required: true })
        stateIdentifier: string,
        @Context()
        context: any,
    ): Promise<State> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(context, RegionService);

        return await service.getCountryState(countryIdentifier, stateIdentifier, requestContext, context);
    }
}
