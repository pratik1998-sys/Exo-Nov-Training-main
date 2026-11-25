import { RequestContext } from "@context/request";
import { Contact, ContactFilterInput, ContactInput, ContactResultSet } from "./contact.model";
import { PaginationInput } from "@feature/models";
import { BaseFeatureService } from "@feature/service";

export abstract class ContactService extends BaseFeatureService {
    abstract getContacts(filter: ContactFilterInput, pagination: PaginationInput, requestContext: RequestContext, context?: any): Promise<ContactResultSet>;
    abstract getContact(identifier: string, requestContext: RequestContext, context?: any): Promise<Contact>;
    abstract createContact(contactInput: ContactInput, requestContext: RequestContext, context?: any): Promise<Contact>;
    abstract updateContact(identifier: string, contactInput: ContactInput, requestContext: RequestContext, context?: any): Promise<Contact>;
    abstract deleteContact(identifier: string, requestContext: RequestContext, context?: any): Promise<Contact>;
}
