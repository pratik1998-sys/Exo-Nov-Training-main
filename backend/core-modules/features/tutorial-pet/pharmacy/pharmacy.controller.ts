import { Body, Param, Query, Req } from '@nestjs/common';
import { PharmacyRequestParameters } from './pharmacy.parameters';
import { FastifyRequest } from 'fastify';
import { PharmacyService } from './pharmacy.service';
import { Pharmacy, PharmacyFilterInput, PharmacyInput, PharmacyResultSet, PharmacyResultSetQuery } from './pharmacy.model';
import { PharmacyApiConfiguration } from './pharmacy.api.configuration';
import { PharmacyModule } from './pharmacy.module';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';

const feature = PharmacyModule.feature;

@Controller({ tags: 'pharmacy', path: 'pharmacy', feature })
export class PharmacyController extends BaseFeatureController {
    @Get(PharmacyApiConfiguration.pharmacies().restOptions, feature)
    async pharmacies(@Req() request: FastifyRequest, @Query() query: PharmacyResultSetQuery): Promise<PharmacyResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(request, PharmacyService);

        const filter: PharmacyFilterInput = {};

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        return await service.getPharmacies(filter, resultSetQuery.pagination, requestContext, request);
    }

    @Get(PharmacyApiConfiguration.pharmacy().restOptions, feature)
    async pharmacy(@Param(PharmacyRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(request, PharmacyService);

        return await service.getPharmacy(identifier, requestContext, request);
    }

    @Post(PharmacyApiConfiguration.pharmacyCreate().restOptions, feature)
    async pharmacyCreate(@Body() pharmacyInput: PharmacyInput, @Req() request: FastifyRequest): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(request, PharmacyService);

        return await service.createPharmacy(pharmacyInput, requestContext, request);
    }

    @Put(PharmacyApiConfiguration.pharmacyUpdate().restOptions, feature)
    async pharmacyUpdate(@Param(PharmacyRequestParameters.identifier.id) identifier: string, @Body() pharmacyInput: PharmacyInput, @Req() request: FastifyRequest): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(request, PharmacyService);

        return await service.updatePharmacy(identifier, pharmacyInput, requestContext, request);
    }

    @Delete(PharmacyApiConfiguration.pharmacyDelete().restOptions, feature)
    async pharmacyDelete(@Param(PharmacyRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Pharmacy> {
        const { requestContext, service } = this.getRequestContextAndService<PharmacyService>(request, PharmacyService);

        return await service.deletePharmacy(identifier, requestContext, request);
    }
}
