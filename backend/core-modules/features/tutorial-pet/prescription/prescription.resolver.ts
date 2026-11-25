import { Context } from '@nestjs/graphql';
import { Prescription, PrescriptionFilterInput, PrescriptionInput, PrescriptionResultSet } from './prescription.model';
import { PrescriptionService } from './prescription.service';
import { PrescriptionRequestParameters } from './prescription.parameters';
import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { BaseFeatureResolver } from '@feature/resolver';
import { PrescriptionApiConfiguration } from './prescription.api.configuration';
import { PrescriptionModule } from './prescription.module';
import { PaginationInput } from '@feature/models';

const feature = PrescriptionModule.feature;

@Resolver((of) => Prescription, { feature })
export class PrescriptionResolver extends BaseFeatureResolver {
    @Query(() => PrescriptionResultSet, PrescriptionApiConfiguration.prescriptions().queryOptions, feature)
    async prescriptions(
        @Args({ parameter: PrescriptionRequestParameters.filter, type: () => PrescriptionFilterInput, required: false })
        filter: PrescriptionFilterInput,
        @Args({ parameter: PrescriptionRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<PrescriptionResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(context, PrescriptionService);

        return await service.getPrescriptions(filter, pagination, requestContext, context);
    }

    @Query(() => Prescription, PrescriptionApiConfiguration.prescription().queryOptions, feature)
    async prescription(
        @Args({ parameter: PrescriptionRequestParameters.identifier, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(context, PrescriptionService);

        return await service.getPrescription(id, requestContext, context);
    }

    @Mutation(() => Prescription, PrescriptionApiConfiguration.prescriptionCreate().mutationOptions, feature)
    async prescriptionCreate(
        @Args({ parameter: PrescriptionRequestParameters.prescription, type: () => PrescriptionInput, required: true })
        prescription: PrescriptionInput,
        @Context()
        context: any,
    ): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(context, PrescriptionService);

        return await service.createPrescription(prescription, requestContext, context);
    }

    @Mutation(() => Prescription, PrescriptionApiConfiguration.prescriptionUpdate().mutationOptions, feature)
    async prescriptionUpdate(
        @Args({ parameter: PrescriptionRequestParameters.identifier, required: true })
        id: string,
        @Args({ parameter: PrescriptionRequestParameters.prescription, type: () => PrescriptionInput, required: true })
        contact: PrescriptionInput,
        @Context()
        context: any,
    ): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(context, PrescriptionService);

        return await service.updatePrescription(id, contact, requestContext, context);
    }

    @Mutation(() => Prescription, PrescriptionApiConfiguration.prescriptionDelete().mutationOptions, feature)
    async prescriptionDelete(
        @Args({ parameter: PrescriptionRequestParameters.identifier, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<Prescription> {
        const { requestContext, service } = this.getRequestContextAndService<PrescriptionService>(context, PrescriptionService);

        return await service.deletePrescription(id, requestContext, context);
    }
}
