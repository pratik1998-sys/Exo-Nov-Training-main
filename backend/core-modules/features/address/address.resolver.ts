import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { Address, AddressInput, AddressResultSet } from './address.model';
import { AddressApiConfiguration } from './address.api.configuration';
import { AddressRequestParameters } from './address.parameters';
import { AddressService } from './address.service';
import { AddressModule } from './address.module';
import { PaginationInput } from '@feature/models';
import { BaseFeatureResolver } from '@feature/resolver';
import { Context } from '@nestjs/graphql';

const feature = AddressModule.feature;

@Resolver((of) => Address, { feature })
export class AddressResolver extends BaseFeatureResolver {
    @Query(() => AddressResultSet, AddressApiConfiguration.addresses().queryOptions, feature)
    async addresses(
        // @Args({ parameter: AddressRequestParameters.filter, required: false })
        // filter: AddressFilterInput,
        @Args({ parameter: AddressRequestParameters.pagination, required: false })
        pagination: PaginationInput,
        @Context() context: any,
    ): Promise<AddressResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(context, AddressService);

        return await service.getAddresses(null, pagination, requestContext, context);
    }

    @Query(() => Address, AddressApiConfiguration.address().queryOptions, feature)
    async address(
        @Args({ parameter: AddressRequestParameters.id, required: true })
        id: string,
        @Context() context: any,
    ): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(context, AddressService);

        return await service.getAddress(id, requestContext, context);
    }

    @Mutation(() => Address, AddressApiConfiguration.addressCreate().mutationOptions, feature)
    async addressCreate(
        @Args({ parameter: AddressRequestParameters.address, type: () => AddressInput, required: true })
        address: AddressInput,
        @Context() context: any,
    ): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(context, AddressService);

        return await service.createAddress(address, true, requestContext, context);
    }

    @Mutation(() => Address, AddressApiConfiguration.addressUpdate().mutationOptions, feature)
    async addressUpdate(
        @Args({ parameter: AddressRequestParameters.id, required: true })
        id: string,
        @Args({ parameter: AddressRequestParameters.address, type: () => AddressInput, required: true })
        address: AddressInput,
        @Context() context: any,
    ): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(context, AddressService);

        return await service.updateAddress(id, address, true, requestContext, context);
    }

    @Mutation(() => Address, AddressApiConfiguration.addressDelete().mutationOptions, feature)
    async addressDelete(
        @Args({ parameter: AddressRequestParameters.id, required: true })
        id: string,
        @Context() context: any,
    ): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(context, AddressService);

        return await service.deleteAddress(id, true, requestContext, context);
    }
}
