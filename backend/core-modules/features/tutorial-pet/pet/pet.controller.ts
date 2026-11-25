import { Body, Param, Query, Req } from '@nestjs/common';
import { PetRequestParameters } from './pet.parameters';
import { Pet, PetFilterInput, PetInput, PetResultSet, PetResultSetQuery } from './pet.model';
import { FastifyRequest } from 'fastify';
import { PetService } from './pet.service';
import { PetModule } from './pet.module';
import { PetApiConfiguration } from './pet.api.configuration';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';

const feature = PetModule.feature;

@Controller({ tags: 'pet', path: 'pet', feature })
export class PetController extends BaseFeatureController {
    @Get(PetApiConfiguration.pets().restOptions, feature)
    async pets(@Req() request: FastifyRequest, @Query() query: PetResultSetQuery): Promise<PetResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(request, PetService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const filter: PetFilterInput = {
            identifiers: query.identifiers,
            userIdentifier: query.userIdentifier,
            firstName: query.firstName,
        };

        return await service.getPets(filter, resultSetQuery.pagination, requestContext, request);
    }

    @Get(PetApiConfiguration.pet().restOptions, feature)
    async pet(@Param(PetRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(request, PetService);

        return await service.getPet(identifier, requestContext, request);
    }

    @Post(PetApiConfiguration.petCreate().restOptions, feature)
    async petCreate(@Body() petInput: PetInput, @Req() request: FastifyRequest): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(request, PetService);

        return await service.createPet(petInput, requestContext, request);
    }

    @Put(PetApiConfiguration.petUpdate().restOptions, feature)
    async petUpdate(@Param(PetRequestParameters.identifier.id) identifier: string, @Body() petInput: PetInput, @Req() request: FastifyRequest): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(request, PetService);

        return await service.updatePet(identifier, petInput, requestContext, request);
    }

    @Delete(PetApiConfiguration.petDelete().restOptions, feature)
    async petDelete(@Param(PetRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Pet> {
        const { requestContext, service } = this.getRequestContextAndService<PetService>(request, PetService);

        return await service.deletePet(identifier, requestContext, request);
    }
}
