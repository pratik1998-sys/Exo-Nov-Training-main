import { ApiConfiguration, ApiOperationDefinition, ApiOperationOptions } from '@api';
import {
    ShoppingList,
    ShoppingListInput,
    ShoppingListItemAddInput,
    ShoppingListItemsAddInputBody,
    ShoppingListItemsDeleteInputBody,
    ShoppingListItemsUpdateInputBody,
    ShoppingListItemUpdateInput,
    ShoppingListResultSet,
} from './shopping-list.model';
import { ShoppingListRequestParameters } from './shopping-list.parameters';

export interface ShoppingListApiOperations {
    shoppingLists: ApiOperationDefinition;
    shoppingList: ApiOperationDefinition;
    shoppingListCreate: ApiOperationDefinition;
    shoppingListUpdate: ApiOperationDefinition;
    shoppingListDelete: ApiOperationDefinition;
    shoppingListItemAdd: ApiOperationDefinition;
    shoppingListItemsAdd: ApiOperationDefinition;
    shoppingListItemUpdate: ApiOperationDefinition;
    shoppingListItemsUpdate: ApiOperationDefinition;
    shoppingListItemDelete: ApiOperationDefinition;
    shoppingListItemsDelete: ApiOperationDefinition;
}

export class ShoppingListApiConfiguration extends ApiConfiguration {
    static operations: ShoppingListApiOperations = {
        shoppingLists: {
            id: 'shoppingLists',
            description: 'Get shopping lists',
            summary: 'Get shopping lists',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: ShoppingListResultSet,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        shoppingList: {
            id: 'shoppingList',
            description: 'Get a shopping list',
            summary: 'Get a shopping list',
            isAuthRequired: false,
            restOptions: {
                isById: true,
                path: `/:${ShoppingListRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                tags: [],
            },
            queryOptions: {
                required: false,
            },
        },
        shoppingListCreate: {
            id: 'shoppingListCreate',
            description: 'Create a shopping list',
            summary: 'Create a shopping list',
            isAuthRequired: false,
            restOptions: {
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                apiBodyOptions: {
                    type: ShoppingListInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            }
        },
        shoppingListUpdate: {
            id: 'shoppingListUpdate',
            description: 'Update shopping list metadata',
            summary: 'Update shopping list',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                apiBodyOptions: {
                    type: ShoppingListInput,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        shoppingListDelete: {
            id: 'shoppingListDelete',
            description: 'Delete a shopping list',
            summary: 'Delete a shopping list',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                tags: [],
            },
            mutationOptions: {
                required: false,
            },
        },
        shoppingListItemAdd: {
            id: 'shoppingListItemAdd',
            description: 'Add one line to a shopping list. If the list id is omitted or current, a new shopping list is created, then the line is added.',
            summary: 'Add shopping list line',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}/item`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                apiBodyOptions: {
                    type: ShoppingListItemAddInput,
                },
                tags: [],
            },
        },
        shoppingListItemsAdd: {
            id: 'shoppingListItemsAdd',
            description: 'Add lines to a shopping list. If the list id is omitted or current, a new shopping list is created, then the lines are added.',
            summary: 'Add shopping list lines',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}/items`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                apiBodyOptions: {
                    type: ShoppingListItemsAddInputBody,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        shoppingListItemUpdate: {
            id: 'shoppingListItemUpdate',
            description: 'Update one shopping list line',
            summary: 'Update shopping list line',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}/item/:${ShoppingListRequestParameters.itemId.id}`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                apiBodyOptions: {
                    type: ShoppingListItemUpdateInput,
                },
                tags: [],
            },
        },
        shoppingListItemsUpdate: {
            id: 'shoppingListItemsUpdate',
            description: 'Update shopping list lines',
            summary: 'Update shopping list lines',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}/items`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                apiBodyOptions: {
                    type: ShoppingListItemsUpdateInputBody,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
        shoppingListItemDelete: {
            id: 'shoppingListItemDelete',
            description: 'Delete one shopping list line',
            summary: 'Delete shopping list line',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}/item/:${ShoppingListRequestParameters.itemId.id}`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                tags: [],
            },
        },
        shoppingListItemsDelete: {
            id: 'shoppingListItemsDelete',
            description: 'Delete shopping list lines',
            summary: 'Delete shopping list lines',
            isAuthRequired: false,
            restOptions: {
                path: `/:${ShoppingListRequestParameters.id.id}/items/@delete`,
                apiOkResponseOptions: {
                    type: ShoppingList,
                },
                apiBodyOptions: {
                    type: ShoppingListItemsDeleteInputBody,
                },
                tags: [],
            },
            mutationOptions: {
                required: true,
            },
        },
    }

    static shoppingLists(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingLists);
    }

    static shoppingList(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingList);
    }

    static shoppingListCreate(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListCreate);
    }


    static shoppingListUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListUpdate);
    }

    static shoppingListDelete(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListDelete);
    }

    static shoppingListItemAdd(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListItemAdd);
    }

    static shoppingListItemsAdd(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListItemsAdd);
    }

    static shoppingListItemUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListItemUpdate);
    }

    static shoppingListItemsUpdate(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListItemsUpdate);
    }

    static shoppingListItemDelete(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListItemDelete);
    }

    static shoppingListItemsDelete(): ApiOperationOptions {
        return this.composeOperationOptions(ShoppingListApiConfiguration.operations.shoppingListItemsDelete);
    }
}
