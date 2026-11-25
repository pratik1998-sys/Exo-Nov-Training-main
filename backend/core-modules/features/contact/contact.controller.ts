import { Contact, ContactFilterInput, ContactInput, ContactResultSet, ContactResultSetQuery } from './contact.model';
import { ContactApiConfiguration } from './contact.api.configuration';
import { ContactModule } from './contact.module';
import { ContactRequestParameters } from './contact.parameters';
import { Body, Param, Query, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { BaseFeatureController } from '@feature/controller';
import { Controller, Delete, Get, Post, Put } from '@api-decorators';
import { ResultSetQueryType } from '@feature/controller/types';
import { ContactService } from './contact.service';

const paths = {
    root: 'contact',
};

const feature = ContactModule.feature;

@Controller({ tags: 'contact', path: paths.root, feature })
export class ContactController extends BaseFeatureController {
    @Get(ContactApiConfiguration.contacts().restOptions, feature)
    async contacts(@Req() request: FastifyRequest, @Query() query: ContactResultSetQuery): Promise<ContactResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(request, ContactService);

        const resultSetQuery: ResultSetQueryType = this.processResultSetQuery(query);

        const filter: ContactFilterInput = {
            identifiers:
                query.identifiers ?
                    !Array.isArray(query.identifiers) ?
                        [query.identifiers]
                        : query.identifiers
                    : undefined,
        };

        return await service.getContacts(filter, resultSetQuery.pagination, requestContext, request);
    }

    @Get(ContactApiConfiguration.contact().restOptions, feature)
    async contact(@Param(ContactRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(request, ContactService);

        return await service.getContact(id, requestContext, request);
    }

    @Post(ContactApiConfiguration.contactCreate().restOptions, feature)
    async contactCreate(@Body() contactInput: ContactInput, @Req() request: FastifyRequest): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(request, ContactService);

        return await service.createContact(contactInput, requestContext, request);
    }

    @Put(ContactApiConfiguration.contactUpdate().restOptions, feature)
    async contactUpdate(@Param(ContactRequestParameters.id.id) id: string, @Body() contactInput: ContactInput, @Req() request: FastifyRequest): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(request, ContactService);

        return await service.updateContact(id, contactInput, requestContext, request);
    }

    @Delete(ContactApiConfiguration.contactDelete().restOptions, feature)
    async contactDelete(@Param(ContactRequestParameters.id.id) id: string, @Req() request: FastifyRequest): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(request, ContactService);

        return await service.deleteContact(id, requestContext, request);
    }
}
