import { Controller, Get } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { Country, CountryResultSet, CountryResultSetQuery, RegionApiConfiguration, RegionModule, RegionRequestParameters, RegionService, State, StateResultSet, StateResultSetQuery } from '@feature-region';
import { Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';

const paths = {
    root: 'region',
};

const feature = RegionModule.feature;

@Controller({ tags: 'region', path: paths.root, feature })
export class RegionController extends BaseFeatureController {
    @Get(RegionApiConfiguration.countries().restOptions, feature)
    async regionCountries(@Query() query: CountryResultSetQuery, @Req() request: FastifyRequest): Promise<CountryResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(request, RegionService);

        const { pagination } = this.processResultSetQuery(query);

        return await service.getCountries(pagination, requestContext, request);
    }

    @Get(RegionApiConfiguration.country().restOptions, feature)
    async regionCountry(
        @Param(RegionRequestParameters.identifier.id)
        identifier: string,
        @Req() request: FastifyRequest,
    ): Promise<Country> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(request, RegionService);

        return await service.getCountry(identifier, requestContext, request);
    }

    @Get(RegionApiConfiguration.countryStates().restOptions, feature)
    async regionStates(
        @Param(RegionRequestParameters.identifier.id)
        countryIdentifier: string,
        @Query() query: StateResultSetQuery,
        @Req() request: FastifyRequest,
    ): Promise<StateResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(request, RegionService);

        const { pagination } = this.processResultSetQuery(query);

        return await service.getCountryStates(countryIdentifier, pagination, requestContext, request);
    }

    @Get(RegionApiConfiguration.countryState().restOptions, feature)
    async regionState(
        @Param(RegionRequestParameters.identifier.id)
        countryIdentifier: string,
        @Param(RegionRequestParameters.identifier.id)
        stateIdentifier: string,
        @Req() request: FastifyRequest,
    ): Promise<State> {
        const { requestContext, service } = this.getRequestContextAndService<RegionService>(request, RegionService);

        return await service.getCountryState(countryIdentifier, stateIdentifier, requestContext, request);
    }
}
