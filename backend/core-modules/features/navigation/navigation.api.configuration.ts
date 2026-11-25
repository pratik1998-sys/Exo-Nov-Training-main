import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import { FooterNavigation, HeaderNavigation } from './navigation.model';

export interface NavigationApiOperations {
    navigationHeader: ApiOperationDefinition;
    navigationFooter: ApiOperationDefinition;
}

export class NavigationApiConfiguration extends ApiConfiguration {
    static operations: NavigationApiOperations = {
        navigationHeader: {
            id: 'navigationHeader',
            description: 'Get the header navigation',
            summary: 'Get the header navigation',
            isAuthRequired: false,
            restOptions: {
                path: 'header',
                apiOkResponseOptions: {
                    type: HeaderNavigation,
                },
                tags: [],
            },
            queryOptions: {},
        },
        navigationFooter: {
            id: 'navigationFooter',
            description: 'Get the footer navigation',
            summary: 'Get the footer navigation',
            isAuthRequired: false,
            restOptions: {
                path: 'footer',
                apiOkResponseOptions: {
                    type: FooterNavigation,
                },
                tags: [],
            },
            queryOptions: {},
        },
    };

    static navigationHeader(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.navigationHeader);
    }

    static navigationFooter(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.navigationFooter);
    }
}
