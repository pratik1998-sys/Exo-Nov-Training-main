import { CommercetoolsEntityAction, CommercetoolsResultSet } from "@plugin-commercetools/common";
import { CommercetoolsQuote, CommercetoolsQuoteLineItem, QuoteActions } from "@plugin-commercetools/features/quote";

export interface CommercetoolsOrderLineItem extends CommercetoolsQuoteLineItem { }

export interface CommercetoolsOrder extends CommercetoolsQuote {
    orderNumber: string;
    purchaseOrderNumber: string;
    orderState: string;
    lineItems: CommercetoolsOrderLineItem[];
}

export interface CommercetoolsOrderResultSet extends CommercetoolsResultSet {
    results?: CommercetoolsOrder[];
}

export interface CommercetoolsChangeOrderState extends CommercetoolsEntityAction {
    orderState: string;
}

export const OrderStates = {
    open: 'Open',
    confirmed: 'Confirmed',
    complete: 'Complete',
    cancelled: 'Cancelled',
};

export const OrderActions = {
    ...QuoteActions,
    changeOrderState: 'changeOrderState',
};
