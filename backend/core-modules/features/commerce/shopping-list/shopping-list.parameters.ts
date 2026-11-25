import { RequestParameterDefinition } from '@api-parameters';
import { CommerceRequestParameters, CommerceRequestParametersType } from '@feature-commerce/common';

export interface ShoppingListRequestParametersType extends CommerceRequestParametersType {
    itemId: RequestParameterDefinition;
    items: RequestParameterDefinition;
    shoppingList: RequestParameterDefinition;
}

export const ShoppingListRequestParameters: ShoppingListRequestParametersType = {
    ...CommerceRequestParameters,
    itemId: {
        id: 'itemId',
        description: 'shopping list line id',
    },
    items: {
        id: 'items',
        description: 'shopping list lines',
    },
    shoppingList: {
        id: 'shoppingList',
        description: 'shopping list body',
    },
};
