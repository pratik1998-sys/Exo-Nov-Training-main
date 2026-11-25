import { RequestContext } from "@context/request";
import { AddressInput } from "@feature-address";
import { QuoteItemAddInput, QuoteItemUpdateInput, QuoteItemDeleteInput, QuoteShippingMethodInput } from "@feature-commerce/common";
import { ProductFilterInput, ProductService } from "@feature-commerce/product";
import { CommercetoolsBaseServiceImpl, CommercetoolsConsumerConfiguration, CommercetoolsEntityAction, CommercetoolsEntityActionRequest, CommercetoolsEntityQueryParams } from "@plugin-commercetools/common";
import { CommercetoolsAddressMapper } from "@plugin-commercetools/features/address";
import { CommercetoolsProductMapper, CommercetoolsAttribute, CommercetoolsProductTypeRegistry } from "@plugin-commercetools/features/product";
import { CommercetoolsQuote, CommercetoolsQuoteActionAddItem, CommercetoolsQuoteActionAddItems, CommercetoolsQuoteActionRemoveItem, CommercetoolsQuoteActionUpdateItemQuantity, CommercetoolsQuoteLineItem, CommercetoolsQuoteSetShippingAddress, CommercetoolsQuoteSetShippingMethod, QuoteActions } from "./schema/commercetools.quote.schema";

export abstract class CommercetoolsQuoteServiceImpl extends CommercetoolsBaseServiceImpl {
    protected async finalizeQuote(requestContext: RequestContext, dsQuote: CommercetoolsQuote) {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        const productIdLineItemsMap: Record<string, CommercetoolsQuoteLineItem[]> = {};

        dsQuote.lineItems.forEach((dsLineItem) => {
            if (!productIdLineItemsMap[dsLineItem.productId]) {
                productIdLineItemsMap[dsLineItem.productId] = [];
            }

            productIdLineItemsMap[dsLineItem.productId].push(dsLineItem);
        });

        if (configuration.doFetchProduct) {
            const productMapper = this.getMapper<CommercetoolsProductMapper>(requestContext, CommercetoolsProductMapper);

            const productFilter: ProductFilterInput = {
                product: {
                    ids: Object.keys(productIdLineItemsMap),
                },
            };

            const productResult = await this.getService<ProductService>(requestContext, ProductService).getProducts(
                productFilter,
                { pageSize: productFilter.product.ids.length },
                null,
                requestContext,
                null,
                true,
            );

            productResult?.results.forEach((product) => {
                productIdLineItemsMap[product.id]?.forEach((dsLineItem) => {
                    dsLineItem.variant._name = product.name;
                    dsLineItem.variant._description = product.description;
                    dsLineItem.variant._slug = product.slug;

                    const dsAttributeDefinitionMap: Record<string, CommercetoolsAttribute> = this.getRegistry<CommercetoolsProductTypeRegistry>(
                        requestContext,
                        CommercetoolsProductTypeRegistry,
                    ).getProductTypeAttributes(dsLineItem.productType.id);

                    // productMapper.setVariantFieldsOnProduct(requestContext, dsLineItem._product, productMapper.mapVariant(requestContext, dsLineItem.variant, dsAttributeDefinitionMap));
                });
            });
        }
    }

    protected composeBody_addLineItems(requestContext: RequestContext, dsQuote: CommercetoolsQuote, items: QuoteItemAddInput[]) {
        const body = this.composeEntityAction(dsQuote.version) as CommercetoolsQuoteActionAddItems;

        body.actions = items.map((item) => this.composeAction_addLineItem(requestContext, dsQuote, item));

        return body;
    }

    protected composeAction_addLineItem(requestContext: RequestContext, dsQuote: CommercetoolsQuote, item: QuoteItemAddInput) {
        const action: CommercetoolsQuoteActionAddItem = {
            action: QuoteActions.addLineItem,
            sku: item.identifier,
            quantity: item.quantity,
        };

        return action;
    }

    protected composeBody_updateLineItems(requestContext: RequestContext, dsQuote: CommercetoolsQuote, items: QuoteItemUpdateInput[]) {
        const body = this.composeEntityAction(dsQuote.version) as CommercetoolsEntityActionRequest;

        items.forEach((item) => {
            const dsLineItem = dsQuote.lineItems.find((dsLineItem) => dsLineItem.id == item.id);

            this.composeActions_updateLineItem(requestContext, dsQuote, dsLineItem, item, body.actions);
        });

        return body;
    }

    protected composeActions_updateLineItem(
        requestContext: RequestContext,
        dsQuote: CommercetoolsQuote,
        dsLineItem: CommercetoolsQuoteLineItem,
        item: QuoteItemUpdateInput,
        actions: CommercetoolsEntityAction[],
    ) {
        if (item.hasOwnProperty('quantity')) {
            actions.push(this.composeAction_updateLineItemQuantity(requestContext, dsQuote, dsLineItem, item));
        }
    }

    protected composeAction_updateLineItemQuantity(requestContext: RequestContext, dsQuote: CommercetoolsQuote, dsLineItem: CommercetoolsQuoteLineItem, item: QuoteItemUpdateInput) {
        const action: CommercetoolsQuoteActionUpdateItemQuantity = {
            action: QuoteActions.changeLineItemQuantity,
            lineItemId: item.id,
            quantity: item.quantity,
        };

        return action;
    }

    protected composeBody_removeLineItems(requestContext: RequestContext, dsQuote: CommercetoolsQuote, items: QuoteItemDeleteInput[]) {
        const body = this.composeEntityAction(dsQuote.version) as CommercetoolsEntityActionRequest;

        body.actions = items.map((item) => this.composeAction_removeLineItem(requestContext, dsQuote, item));

        return body;
    }

    protected composeAction_removeLineItem(requestContext: RequestContext, dsQuote: CommercetoolsQuote, item: QuoteItemDeleteInput) {
        const action: CommercetoolsQuoteActionRemoveItem = {
            action: QuoteActions.removeLineItem,
            lineItemId: item.id,
        };

        return action;
    }

    protected composeQuery_shippingMethods(requestContext: RequestContext) {
        const query: CommercetoolsEntityQueryParams = {
            expand: [],
        };

        return query;
    }

    protected composeQuery_getQuote(requestContext: RequestContext): CommercetoolsEntityQueryParams {
        const query: CommercetoolsEntityQueryParams = {
            expand: ['discountCodes[*].discountCode', 'discountOnTotalPrice.includedDiscounts[*].discount', 'shippingInfo.shippingMethod'],
        };

        return query;
    }

    protected composeQuery_updateQuote(requestContext: RequestContext, dsQuote: CommercetoolsQuote): CommercetoolsEntityQueryParams {
        const query = this.composeQuery_getQuote(requestContext);

        return query;
    }

    protected composeQuery_deleteQuote(requestContext: RequestContext, dsQuote: CommercetoolsQuote): CommercetoolsEntityQueryParams {
        const { configuration } = this.getPluginConsumerConfiguration<CommercetoolsConsumerConfiguration>(requestContext);

        const query = this.composeQuery_updateQuote(requestContext, dsQuote);

        query.version = dsQuote.version;
        query.dataErasure = configuration.doDataErasureOnDelete;

        return query;
    }

    protected composeBody_updateShipping(requestContext: RequestContext, dsQuote: CommercetoolsQuote, address: AddressInput, shippingMethod: QuoteShippingMethodInput) {
        const body = this.composeEntityAction(dsQuote.version) as CommercetoolsEntityActionRequest;

        if (address) {
            body.actions.push(this.composeAction_setShippingAddress(requestContext, dsQuote, address));
        }

        if (shippingMethod) {
            body.actions.push(this.composeAction_setShippingMethod(requestContext, dsQuote, shippingMethod));
        }

        return body;
    }

    protected composeAction_setShippingAddress(requestContext: RequestContext, dsQuote: CommercetoolsQuote, address: AddressInput) {
        const action: CommercetoolsQuoteSetShippingAddress = {
            action: QuoteActions.setShippingAddress,
            address: this.getMapper<CommercetoolsAddressMapper>(requestContext, CommercetoolsAddressMapper).composeAddressInput(requestContext, address),
        };

        return action;
    }

    protected composeAction_setShippingMethod(requestContext: RequestContext, dsQuote: CommercetoolsQuote, shippingMethod: QuoteShippingMethodInput) {
        const action: CommercetoolsQuoteSetShippingMethod = {
            action: QuoteActions.setShippingMethod,
            shippingMethod: {
                id: shippingMethod.id,
                typeId: 'shipping-method',
            },
        };

        return action;
    }
}
