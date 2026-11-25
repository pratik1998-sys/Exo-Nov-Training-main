import { Args, Mutation, Query, Resolver } from '@api-decorators';
import { Contact, ContactFilterInput, ContactInput, ContactResultSet } from './contact.model';
import { ContactApiConfiguration } from './contact.api.configuration';
import { ContactModule } from './contact.module';
import { ContactRequestParameters } from './contact.parameters';
import { ContactService } from './contact.service';
import { PaginationInput } from '@feature/models';
import { BaseFeatureResolver } from '@feature/resolver';
import { Context } from '@nestjs/graphql';

const feature = ContactModule.feature;

@Resolver((of) => Contact, { feature })
export class ContactResolver extends BaseFeatureResolver {
    @Query(() => ContactResultSet, ContactApiConfiguration.contacts().queryOptions, feature)
    async contacts(
        @Args({ parameter: ContactRequestParameters.filter, type: () => ContactFilterInput, required: false })
        filter: ContactFilterInput,
        @Args({ parameter: ContactRequestParameters.pagination, type: () => PaginationInput, required: false })
        pagination: PaginationInput,
        @Context()
        context: any,
    ): Promise<ContactResultSet> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(context, ContactService);

        return await service.getContacts(filter, pagination, requestContext, context);
    }

    @Query(() => Contact, ContactApiConfiguration.contact().queryOptions, feature)
    async contact(
        @Args({ parameter: ContactRequestParameters.id, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(context, ContactService);

        return await service.getContact(id, requestContext, context);
    }

    @Mutation(() => Contact, ContactApiConfiguration.contactCreate().mutationOptions, feature)
    async contactCreate(
        @Args({ parameter: ContactRequestParameters.contact, type: () => ContactInput, required: true })
        contact: ContactInput,
        @Context()
        context: any,
    ): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(context, ContactService);

        return await service.createContact(contact, requestContext, context);
    }

    @Mutation(() => Contact, ContactApiConfiguration.contactUpdate().mutationOptions, feature)
    async contactUpdate(
        @Args({ parameter: ContactRequestParameters.id, required: true })
        id: string,
        @Args({ parameter: ContactRequestParameters.contact, type: () => ContactInput, required: true })
        contact: ContactInput,
        @Context()
        context: any,
    ): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(context, ContactService);

        return await service.updateContact(id, contact, requestContext, context);
    }

    @Mutation(() => Contact, ContactApiConfiguration.contactDelete().mutationOptions, feature)
    async contactDelete(
        @Args({ parameter: ContactRequestParameters.id, required: true })
        id: string,
        @Context()
        context: any,
    ): Promise<Contact> {
        const { requestContext, service } = this.getRequestContextAndService<ContactService>(context, ContactService);

        return await service.deleteContact(id, requestContext, context);
    }
}
