import { Body, Param, Query, Req } from '@nestjs/common';
import { VeterinarianRequestParameters } from './veterinarian.parameters';
import { FastifyRequest } from 'fastify';
import { VeterinarianService } from './veterinarian.service';
import { VeterinarianApiConfiguration } from './veterinarian.api.configuration';
import { VeterinarianModule } from './veterinarian.module';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';
import { VeterinarianResultSetQuery, VeterinarianResultSet, VeterinarianFilterInput, Veterinarian, VeterinarianInput } from './veterinarian.model';

const feature = VeterinarianModule.feature;

@Controller({ tags: 'veterinarian', path: 'veterinarian', feature })
export class VeterinarianController extends BaseFeatureController {
    @Get(VeterinarianApiConfiguration.veterinarians().restOptions, feature)
    async veterinarians(@Req() request: FastifyRequest, @Query() query: VeterinarianResultSetQuery): Promise<VeterinarianResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(request, VeterinarianService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const filter: VeterinarianFilterInput = {
            identifiers: query.identifiers,
        };

        return await service.getVeterinarians(filter, resultSetQuery.pagination, requestContext, request);
    }

    @Get(VeterinarianApiConfiguration.veterinarian().restOptions, feature)
    async veterinarian(@Param(VeterinarianRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(request, VeterinarianService);

        return await service.getVeterinarian(identifier, requestContext, request);
    }

    @Post(VeterinarianApiConfiguration.veterinarianCreate().restOptions, feature)
    async veterinarianCreate(@Body() veterinarianInput: VeterinarianInput, @Req() request: FastifyRequest): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(request, VeterinarianService);

        return await service.createVeterinarian(veterinarianInput, requestContext, request);
    }

    @Put(VeterinarianApiConfiguration.veterinarianUpdate().restOptions, feature)
    async veterinarianUpdate(
        @Param(VeterinarianRequestParameters.identifier.id) identifier: string,
        @Body() veterinarianInput: VeterinarianInput,
        @Req() request: FastifyRequest,
    ): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(request, VeterinarianService);

        return await service.updateVeterinarian(identifier, veterinarianInput, requestContext, request);
    }

    @Delete(VeterinarianApiConfiguration.veterinarianDelete().restOptions, feature)
    async veterinarianDelete(@Param(VeterinarianRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Veterinarian> {
        const { requestContext, service } = this.getRequestContextAndService<VeterinarianService>(request, VeterinarianService);

        return await service.deleteVeterinarian(identifier, requestContext, request);
    }
}
