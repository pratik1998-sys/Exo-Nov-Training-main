import { CommercetoolsEntity, CommercetoolsLocaleField, CommercetoolsReferenceField, CommercetoolsReferenceFieldInput, CommercetoolsResultSet } from '@plugin-commercetools/common';
import { CommercetoolsQuoteLineItem } from '@plugin-commercetools/features/quote';

export interface CommercetoolsShoppingListDraft {
    key?: string;
    customer?: CommercetoolsReferenceFieldInput;
    anonymousId?: string;
    store?: CommercetoolsReferenceFieldInput;
    name?: CommercetoolsLocaleField;
}

export type CommercetoolsShoppingListLineItem = CommercetoolsQuoteLineItem;

export interface CommercetoolsShoppingList extends CommercetoolsEntity {
    version: number;
    createdAt?: string;
    lastModifiedAt?: string;
    name?: CommercetoolsLocaleField;
    lineItems?: CommercetoolsShoppingListLineItem[];
    customer?: CommercetoolsReferenceField;
    anonymousId?: string;
    store?: CommercetoolsReferenceField;
}

export interface CommercetoolsShoppingListResultSet extends CommercetoolsResultSet {
    results?: CommercetoolsShoppingList[];
}

export const ShoppingListActions = {
    addLineItem: 'addLineItem',
    removeLineItem: 'removeLineItem',
    changeLineItemQuantity: 'changeLineItemQuantity',
    changeName: 'changeName',
};
