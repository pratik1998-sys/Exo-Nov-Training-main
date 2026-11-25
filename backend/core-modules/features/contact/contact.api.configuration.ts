
import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import { Contact, ContactFilterInput, ContactInput, ContactResultSet } from './contact.model';
import { ContactRequestParameters } from './contact.parameters';

export interface ContactApiOperations {
    contacts: ApiOperationDefinition;
    contact: ApiOperationDefinition;
    contactCreate: ApiOperationDefinition;
    contactUpdate: ApiOperationDefinition;
    contactDelete: ApiOperationDefinition;
}

export class ContactApiConfiguration extends ApiConfiguration {
    static operations: ContactApiOperations = {
        contacts: {
            id: 'contacts',
            description: 'Get contacts',
            summary: 'Get contacts',
            restOptions: {
                apiOkResponseOptions: {
                    type: ContactResultSet,
                },
                apiBodyOptions: {
                    type: ContactFilterInput,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        contact: {
            id: 'contact',
            description: 'Get contact',
            summary: 'Get contact',
            restOptions: {
                path: `:${ContactRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: Contact,
                },
                apiBodyOptions: {
                    type: ContactInput,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        contactCreate: {
            id: 'contactCreate',
            description: 'Create contact',
            summary: 'Create contact',
            restOptions: {
                apiOkResponseOptions: {
                    type: Contact,
                },
                apiBodyOptions: {
                    type: ContactInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        contactUpdate: {
            id: 'contactUpdate',
            description: 'Update contact',
            summary: 'Update contact',
            restOptions: {
                apiOkResponseOptions: {
                    type: Contact,
                },
                apiBodyOptions: {
                    type: ContactInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        contactDelete: {
            id: 'contactDelete',
            description: 'Delete contact',
            summary: 'Delete contact',
            restOptions: {
                apiOkResponseOptions: {
                    type: Contact,
                },
                apiBodyOptions: {
                    type: ContactInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
    };

    static contacts(): ApiOperationOptions {
        return this.composeOperationOptions(ContactApiConfiguration.operations.contacts);
    }

    static contact(): ApiOperationOptions {
        return this.composeOperationOptions(ContactApiConfiguration.operations.contact);
    }

    static contactCreate(): ApiOperationOptions {
        return this.composeOperationOptions(ContactApiConfiguration.operations.contactCreate);
    }

    static contactUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(ContactApiConfiguration.operations.contactUpdate);
    }

    static contactDelete(): ApiOperationOptions {
        return this.composeOperationOptions(ContactApiConfiguration.operations.contactDelete);
    }
}
