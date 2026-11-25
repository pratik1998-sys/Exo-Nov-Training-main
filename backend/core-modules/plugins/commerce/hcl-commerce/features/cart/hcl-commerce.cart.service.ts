import { RequestContext } from "@context/request";
import { Address, AddressService } from "@feature-address";
import { CartService, Cart, CartUpdateInput, CartItemAddInput, CartItemUpdateInput, CartItemDeleteInput, CartPaymentOptions, CartShippingOptions, CartAddressInput, CartShippingMethodInput, CartPaymentMethodInput, CartCheckout, CartErrors } from "@feature-commerce/cart";
import { ItemFilterInput, PaymentMethodOption, ShippingMethodResultSet } from "@feature-commerce/common";
import { PaginationInput, SortByInput } from "@feature/models";
import { AddOrderItem, UpdateOrderItem, UpdateOrderShippingInfo, ApplyPromotionCode, CalculateOrder } from "./graphql/schema/hcl-commerce.cart.schema";
import { HCLCommerceCartMapper } from "./hcl-commerce.cart.mapper";
import { HCLCommerceCartDatasource } from "./hcl-commerce.cart.datasource";
import { HCLCommerceOrderServiceImpl } from "@plugin-hcl-commerce/features/order";
import { HCLCommerceQuoteServiceImpl } from "@plugin-hcl-commerce/features/quote";
import { StringUtility } from "@utilities";

export class HCLCommerceCartServiceImpl extends HCLCommerceQuoteServiceImpl implements CartService {
    async deleteCart(id: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        id = this.resolveCartId(requestContext, id);

        throw new Error('Method not implemented.');
    }

    async getCart(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.getCart`;

        id = this.resolveCartId(requestContext, id);

        let dsCart = null;

        try {
            dsCart = await this.getCartDatasource(requestContext).getCart(requestContext);

            await this.addProductsToItems(dsCart, requestContext, context);
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching cart: ${error}`, requestContext);
            // Fail silently
        }

        return this.getMapper<HCLCommerceCartMapper>(requestContext).mapCart(requestContext, dsCart);
    }

    async updateCart(
        id: string,
        updateCartInput: CartUpdateInput,
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.updateCart`;

        id = this.resolveCartId(requestContext, id);

        throw new Error('Method not implemented.');
    }

    async addCartItems(
        id: string,
        items: CartItemAddInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.addCartItems`;

        id = this.resolveCartId(requestContext, id);

        const body = this.composeAddCartItemsBody(requestContext, items);

        try {
            const dsResult = await this.getCartDatasource(requestContext).addOrderItems(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error adding cart items: ${this.logger.formatJSON(items)} ${error}`, requestContext);
            throw CartErrors.addCartItemsFailed();
        }

        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    async updateCartItems(
        id: string,
        items: CartItemUpdateInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.updateCartItems`;

        id = this.resolveCartId(requestContext, id);

        let dsCart;

        const body: UpdateOrderItem.Body = {
            orderItem: items.map((item) => {
                return {
                    orderItemId: item.id,
                    quantity: `${item.quantity}`,
                };
            }),
        };

        try {
            const dsResult = await this.getCartDatasource(requestContext).updateOrderItems(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error updating cart items: ${this.logger.formatJSON(items)} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.updateCartItemsFailed();
        }

        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    async deleteCartItems(
        id: string,
        items: CartItemDeleteInput[],
        filterInput: ItemFilterInput,
        paginationInput: PaginationInput,
        sortByInput: SortByInput,
        requestContext: RequestContext,
        context?: any,
    ): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.deleteCartItems`;

        id = this.resolveCartId(requestContext, id);

        let dsCart;

        const body: UpdateOrderItem.Body = {
            orderItem: items.map((item) => {
                return {
                    orderItemId: item.id,
                    quantity: '0',
                };
            }),
        };

        try {
            const dsResult = await this.getCartDatasource(requestContext).updateOrderItems(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error deleting cart items: ${this.logger.formatJSON(items)} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.deleteCartItemsFailed();
        }

        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    async getPaymentOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartPaymentOptions> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.getPaymentOptions`;

        id = this.resolveCartId(requestContext, id);

        let dsResult;

        const addressMap = {};
        const paymentMethods: PaymentMethodOption[] = [];

        try {
            dsResult = await this.getCartDatasource(requestContext).getUsablePaymentInfo(requestContext);

            dsResult.usablePaymentInformation?.forEach((dsUsablePaymentInformation) => {
                dsUsablePaymentInformation?.usableBillingAddress?.forEach((dsBillingAddress) => {
                    addressMap[dsBillingAddress.addressId] = dsBillingAddress;
                });

                paymentMethods.push(this.getMapper<HCLCommerceCartMapper>(requestContext, HCLCommerceCartMapper).mapPaymentMethodOption(requestContext, dsUsablePaymentInformation));
            });
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching cart payment options: ${error}`, requestContext);
            throw CartErrors.getCartPaymentOptionsFailed();
        }

        const addresses = await this.fetchAddressesByAddressMap(requestContext, addressMap, context);

        return {
            addresses,
            paymentMethods,
        };
    }

    async getShippingOptions(id: string, requestContext: RequestContext, context?: any): Promise<CartShippingOptions> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.getShippingOptions`;

        id = this.resolveCartId(requestContext, id);

        let dsResult;

        let commonShippingMethods: any = {};
        let commonShippingAddresses: any = {};

        try {
            dsResult = await this.getCartDatasource(requestContext).getUsableShippingInfo(requestContext);

            //TODO - Refactor
            let newCommonShippingMethods: any = {};
            // let newCommonShippingAddresses: any = {};

            dsResult.orderItem?.forEach((dsOrderItem, i) => {
                dsOrderItem.usableShippingMode?.forEach((dsUsableShippingMode) => {
                    if (i == 0) {
                        commonShippingMethods[dsUsableShippingMode.shipModeId] = dsUsableShippingMode;
                    } else {
                        if (commonShippingMethods[dsUsableShippingMode.shipModeId]) {
                            newCommonShippingMethods[dsUsableShippingMode.shipModeId] = dsUsableShippingMode;
                        }
                    }
                });

                // dsOrderItem.usableShippingAddress?.forEach((dsUsableShippingAddress) => {
                //     if (i == 0) {
                //         commonShippingAddresses[dsUsableShippingAddress.addressId] = dsUsableShippingAddress;
                //     } else {
                //         if (commonShippingAddresses[dsUsableShippingAddress.addressId]) {
                //             newCommonShippingAddresses[dsUsableShippingAddress.addressId] = dsUsableShippingAddress;
                //         }
                //     }
                // });

                if (i > 0) {
                    commonShippingMethods = newCommonShippingMethods;
                    newCommonShippingMethods = {};

                    // commonShippingAddresses = newCommonShippingAddresses;
                    // newCommonShippingAddresses = {};
                }
            });
        } catch (error) {
            this.logger.error(`${methodname} - Error fetching cart shipping options: ${error}`, requestContext);
            throw CartErrors.getCartShippingOptionsFailed();
        }

        dsResult?.usableShippingAddress?.forEach((dsShippingAddress) => {
            commonShippingAddresses[dsShippingAddress.addressId] = dsShippingAddress;
        });

        const addresses = await this.fetchAddressesByAddressMap(requestContext, commonShippingAddresses, context);

        return {
            addresses: addresses,
            shippingMethods: Object.values(commonShippingMethods).map((dsShippingMethod) =>
                this.getMapper<HCLCommerceCartMapper>(requestContext, HCLCommerceCartMapper).mapShippingMethod(requestContext, dsShippingMethod),
            ),
        };

        //return this.getMapper<HCLCommerceCartMapper>(requestContext, HCLCommerceCartMapper).mapCartShippingInfo(requestContext, Object.values(commonShippingMethods), Object.values(commonShippingAddresses));
    }

    async getShippingMethods(id: string, paginationInput: PaginationInput, requestContext: RequestContext, context?: any): Promise<ShippingMethodResultSet> {
        id = this.resolveCartId(requestContext, id);

        const shippingOptions: CartShippingOptions = await this.getShippingOptions(id, requestContext, context);

        return {
            pagination: {
                pageSize: shippingOptions.shippingMethods.length,
                pageCount: 1,
                resultCount: shippingOptions.shippingMethods.length,
                hasMorePages: false,
                page: 1,
            },
            results: shippingOptions.shippingMethods,
        };
    }

    protected composeAddCartItemsBody(requestContext: RequestContext, items: CartItemAddInput[]): AddOrderItem.Body {
        const body: AddOrderItem.Body = {
            orderId: '.',
            orderItem: items.map((item) => {
                return {
                    productId: item.identifier,
                    quantity: `${item.quantity}`,
                    shipModeId: item.shippingMethod?.id,
                };
            }),
            x_calculateOrder: '1',
            x_calculationUsage: '-1,-2,-3,-4,-5,-6,-7',
            x_inventoryValidation: 'true',
        };

        return body;
    }

    protected async fetchAddressesByAddressMap(requestContext: RequestContext, addressMap: Record<string, any>, context: any): Promise<Address[]> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.fetchAddressesByAddressMap`;

        const addressResultSet = await this.getService<AddressService>(requestContext, AddressService).getAddresses(null, null, requestContext, context);

        const addresses = [];

        addressResultSet.results.forEach((address) => {
            if (addressMap[address.id]) {
                addresses.push(address);
            }
        });

        return addresses;
    }

    async updateShipping(id: string, addressInput: CartAddressInput, shippingMethod: CartShippingMethodInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.updateShipping`;

        id = this.resolveCartId(requestContext, id);

        const async: any[] = [this.getCartDatasource(requestContext).getCart(requestContext)];

        if (StringUtility.isStringEmpty(addressInput.id)) {
            async.push(this.getService<AddressService>(requestContext, AddressService).createAddress(addressInput, false, requestContext, context));
        }

        const results = await Promise.all(async);

        const dsCart: any = results[0];

        let address: Address =
            results.length > 1 ?
                results[1]
                : {
                    id: addressInput.id,
                };

        let body: UpdateOrderShippingInfo.Body = this.composeUpdateShippingBody(requestContext, dsCart, address, shippingMethod);

        try {
            const dsResult = await this.getDatasource<HCLCommerceCartDatasource>(requestContext, HCLCommerceCartDatasource).updateOrderShippingInfo(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error updating cart shipping: ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.updateCartShippingFailed();
        }

        return await this.getCart(null, null, null, null, requestContext, context);
    }

    protected composeUpdateShippingBody(requestContext: RequestContext, dsCart: any, address: Address, shippingMethod: CartShippingMethodInput): UpdateOrderShippingInfo.Body {
        return {
            x_calculationUsage: '-1,-2,-3,-4,-5,-6,-7',
            addressId: address.id,
            shipModeId: shippingMethod.id,
            shipAsComplete: 'true',
            orderItem: dsCart.orderItem.map((orderItem) => {
                return {
                    orderItemId: orderItem.orderItem,
                    shipModeId: shippingMethod.id,
                    addressId: address.id,
                };
            }),
        };
    }

    async addPayments(id: string, paymentMethods: CartPaymentMethodInput[], isSplitPayment: boolean, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.addPayments`;

        id = this.resolveCartId(requestContext, id);

        const dsCart: any = await this.getCartDatasource(requestContext).getCart(requestContext);

        try {
            if (!isSplitPayment) {
                await this.getDatasource<HCLCommerceCartDatasource>(requestContext, HCLCommerceCartDatasource).deleteAllPaymentInstructions(requestContext);
            }

            const paymentMethodIdAddressIdMap: Record<string, string> = {};

            for await (const paymentMethod of paymentMethods) {
                let address: Address = {
                    id: paymentMethod.address.id,
                };

                if (StringUtility.isStringEmpty(paymentMethod.address.id)) {
                    paymentMethod.address.type = 'B';

                    address = await this.getService<AddressService>(requestContext, AddressService).createAddress(paymentMethod.address, false, requestContext, context);
                }

                paymentMethodIdAddressIdMap[paymentMethod.id] = address.id;
            }

            const body: any = {
                orderId: dsCart.orderId,
                paymentInstruction: paymentMethods.map((paymentMethod) => {
                    paymentMethod.address = {
                        id: paymentMethodIdAddressIdMap[paymentMethod.id],
                    }

                    return this.composeAddPaymentsBodyPaymentMethod(requestContext, dsCart, paymentMethod);
                }),
            };

            await this.getDatasource<HCLCommerceCartDatasource>(requestContext, HCLCommerceCartDatasource).addPaymentInstruction(requestContext, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error adding cart payments: ${error}`, requestContext);
            throw CartErrors.addPaymentsFailed();
        }

        return await this.getCart(null, null, null, null, requestContext, context);
    }

    protected composeAddPaymentsBodyPaymentMethod(requestContext: RequestContext, dsCart: any, paymentMethod: CartPaymentMethodInput): any {
        return {
            payMethodId: paymentMethod.identifier,
            policyId: paymentMethod.id,
            piAmount: paymentMethod.amount?.value ?? dsCart.grandTotal,
            billing_address_id: paymentMethod.address.id,
        };
    }

    async addCouponCode(id: string, couponCode: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.addCouponCode`;

        id = this.resolveCartId(requestContext, id);

        let dsCart;

        const body: ApplyPromotionCode.Body = {
            promoCode: couponCode,
        };

        try {
            const dsResult = await this.getCartDatasource(requestContext).applyPromotionCode(requestContext, body);
        } catch (error) {
            this.logger.error(`${methodname} - Error adding coupon code: ${couponCode} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.addCouponCodeFailed();
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async removeCouponCode(id: string, couponCodeId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.removeCouponCode`;

        id = this.resolveCartId(requestContext, id);

        let dsCart;

        try {
            const dsResult = await this.getCartDatasource(requestContext).removePromotionCode(requestContext, couponCodeId);
        } catch (error) {
            this.logger.error(`${methodname} - Error deleting coupon code: ${couponCodeId} ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.removeCouponCodeFailed();
        }

        return await this.getCart(id, null, null, null, requestContext, context);
    }

    async mergeCarts(fromCartId: string, toCartId: string, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.mergeCarts`;

        throw new Error('Method not implemented.');
    }

    async precheckout(id: string, filterInput: ItemFilterInput, paginationInput: PaginationInput, sortByInput: SortByInput, requestContext: RequestContext, context?: any): Promise<Cart> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.precheckout`;

        id = this.resolveCartId(requestContext, id);

        try {
            const dsResult = await this.calculateOrder(id, requestContext);

            await this.getCartDatasource(requestContext).preCheckout(requestContext, { orderId: id ?? '.' });
        } catch (error) {
            this.logger.info(`${methodname} - Error executing cart presubmit: ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.precheckoutFailed();
        }

        return await this.getCart(id, filterInput, paginationInput, sortByInput, requestContext, context);
    }

    protected async calculateOrder(id: string, requestContext: RequestContext): Promise<any> {
        const body = this.composeCalculateOrderBody(id, requestContext);

        const dsResult = await this.getCartDatasource(requestContext).calculateOrder(requestContext, body);

        return dsResult;
    }

    protected composeCalculateOrderBody(id: string, requestContext: RequestContext): any {
        const body: CalculateOrder.Body = {
            calculationUsageId: ['-1', '-2', '-3', '-4', '-5', '-6', '-7'],
        };

        return body;
    }

    async checkout(id: string, requestContext: RequestContext, context?: any): Promise<CartCheckout> {
        const methodname = `${HCLCommerceCartServiceImpl.name}.checkout`;

        id = this.resolveCartId(requestContext, id);

        let dsOrder;

        try {
            await this.precheckout(id, null, null, null, requestContext, context);

            await this.getCartDatasource(requestContext).checkOut(requestContext, { orderId: '.' });
        } catch (error) {
            this.logger.info(`${methodname} - Error submitting order: ${this.logger.formatJSON(error)}`, requestContext);
            throw CartErrors.checkoutFailed();
        }

        return await this.getService<HCLCommerceOrderServiceImpl>(requestContext, HCLCommerceOrderServiceImpl).getOrder(dsOrder.orderId, requestContext, context);
    }

    protected getCartDatasource(requestContext: RequestContext) {
        return this.getDatasource<HCLCommerceCartDatasource>(requestContext, HCLCommerceCartDatasource);
    }

    protected resolveCartId(requestContext: RequestContext, cartId: string): string {
        return StringUtility.isStringEmpty(cartId) || cartId.toLowerCase() == 'current' ? '.' : cartId;
    }
}
