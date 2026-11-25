import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from "@api";
import { UILayoutRequestParameters, UILayoutRest } from "@feature-ui-layout";

export interface UILayoutApiOperations {
    uiLayout: ApiOperationDefinition;
}

export class UILayoutApiConfiguration extends ApiConfiguration {
    static operations: UILayoutApiOperations = {
        uiLayout: {
            id: 'uiLayout',
            description: 'Get UI Layout',
            summary: 'Get UI Layout',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `:${UILayoutRequestParameters.type.id}`,
                apiOkResponseOptions: {
                    type: UILayoutRest
                },
                apiQueryOptions: [
                    {
                        parameter: UILayoutRequestParameters.id,
                        required: false,
                    }
                ],
                tags: []
            },
            queryOptions: {
                required: false,
            }
        }
    }

    static uiLayout(): ApiOperationOptions {
        return this.composeOperationOptions(this.operations.uiLayout);
    }
}