import { Address, AddressFilterInput, AddressInput, AddressResultSet, AddressResultSetQuery } from './address.model';
import { AddressRequestParameters } from './address.parameters';
import { AddressApiConfiguration } from './address.api.configuration';
import { AddressService } from './address.service';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { BaseFeatureController } from '@feature/controller';
import { ResultSetQueryType } from '@feature/controller/types';
import { Body, Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { AddressModule } from './address.module';

const paths = {
    root: 'address',
};

const feature = AddressModule.feature;

@Controller({ tags: 'address', path: paths.root, feature })
export class AddressController extends BaseFeatureController {
    @Get(AddressApiConfiguration.addresses().restOptions, feature)
    async addresses(@Req() request: FastifyRequest, @Query() query: AddressResultSetQuery): Promise<AddressResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(request, AddressService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const { pagination } = resultSetQuery;

        const filter: AddressFilterInput = null;

        return await service.getAddresses(filter, pagination, requestContext, request);
    }

    @Get(AddressApiConfiguration.address().restOptions, feature)
    async address(@Param(AddressRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(request, AddressService);

        return await service.getAddress(id, requestContext, request);
    }

    @Post(AddressApiConfiguration.addressCreate().restOptions, feature)
    async addressCreate(@Body() address: AddressInput, @Req() request: FastifyRequest): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(request, AddressService);

        return await service.createAddress(address, true, requestContext, request);
    }

    @Put(AddressApiConfiguration.addressUpdate().restOptions, feature)
    async addressUpdate(@Param(AddressRequestParameters.id.id) id: string, @Body() address: AddressInput, @Req() request: FastifyRequest): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(request, AddressService);

        return await service.updateAddress(id, address, true, requestContext, request);
    }

    @Delete(AddressApiConfiguration.addressDelete().restOptions, feature)
    async addressDelete(@Param(AddressRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Address> {
        const { requestContext, service } = this.getRequestContextAndService<AddressService>(request, AddressService);

        return await service.deleteAddress(id, true, requestContext, request);
    }
}
