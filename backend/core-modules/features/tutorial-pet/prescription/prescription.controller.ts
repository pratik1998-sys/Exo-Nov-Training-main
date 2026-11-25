import { Body, Param, Query, Req } from '@nestjs/common';
import { PrescriptionRequestParameters } from './prescription.parameters';
import { FastifyRequest } from 'fastify';
import { PrescriptionService } from './prescription.service';
import { Prescription, PrescriptionFilterInput, PrescriptionInput, PrescriptionResultSet, PrescriptionResultSetQuery } from './prescription.model';
import { PrescriptionModule } from './prescription.module';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';
import { PrescriptionApiConfiguration } from './prescription.api.configuration';

const feature = PrescriptionModule.feature;

@Controller({ tags: 'prescription', path: 'prescription', feature })
export class PrescriptionController extends BaseFeatureController {
    @Get(PrescriptionApiConfiguration.prescriptions().restOptions, feature)
    async prescriptions(@Req() request: FastifyRequest, @Query() query: PrescriptionResultSetQuery): Promise<PrescriptionResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(request, PrescriptionService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const filter: PrescriptionFilterInput = {
            identifiers: query.identifiers,
            status: query.status,
        };

        return await service.getPrescriptions(filter, resultSetQuery.pagination, requestContext, request);
    }

    @Get(PrescriptionApiConfiguration.prescription().restOptions, feature)
    async prescription(@Param(PrescriptionRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(request, PrescriptionService);

        return await service.getPrescription(identifier, requestContext, request);
    }

    @Post(PrescriptionApiConfiguration.prescriptionCreate().restOptions, feature)
    async prescriptionCreate(@Body() prescriptionInput: PrescriptionInput, @Req() request: FastifyRequest): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(request, PrescriptionService);

        return await service.createPrescription(prescriptionInput, requestContext, request);
    }

    @Put(PrescriptionApiConfiguration.prescriptionUpdate().restOptions, feature)
    async prescriptionUpdate(
        @Param(PrescriptionRequestParameters.identifier.id) identifier: string,
        @Body() prescriptionInput: PrescriptionInput,
        @Req() request: FastifyRequest,
    ): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(request, PrescriptionService);

        return await service.updatePrescription(identifier, prescriptionInput, requestContext, request);
    }

    @Delete(PrescriptionApiConfiguration.prescriptionDelete().restOptions, feature)
    async prescriptionDelete(@Param(PrescriptionRequestParameters.identifier.id) identifier: string, @Req() request: FastifyRequest): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(request, PrescriptionService);

        return await service.deletePrescription(identifier, requestContext, request);
    }
}
