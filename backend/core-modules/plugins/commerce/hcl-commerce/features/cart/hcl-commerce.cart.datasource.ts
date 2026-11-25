import { RequestContext } from '@context/request';
import {
    GetShippingInfo,
    UpdateOrderShippingInfo,
    CheckOut,
    CsrCancelOrder,
    GetAssignedCouponInfo,
    ApplyCoupon,
    GetUsableShippingMode,
    GetPAttributeDataBean,
    UpdateRewardOption,
    CalculateOrder,
    GetUsableShippingInfo,
    SetPendingOrder,
    UnlockCart,
    GetBuyerPurchaseOrderDataBean,
    AddConfigurationToCart,
    CopyOrder,
    GetAllowableShippingModes,
    UpdateConfigurationInCart,
    ApplyCheckoutProfile,
    MoveOrderItem,
    Repay,
    RemovePromotionCode,
    RemoveCoupon,
    DeleteOrderItem,
    LockCartOnBehalf,
    DeletePaymentInstruction,
    ScheduleOrder,
    AddOrderItem,
    CancelApplePayOrder,
    GetSensitiveDataMaskByPlainString,
    GetPaymentInfo,
    UpdatePaymentInstruction,
    AddPaymentInstruction,
    DeleteAllPaymentInstructions,
    OrderItemDisplay,
    UpdateOrderItem,
    CalculateOrderByOrderId,
    FetchPaymentToken,
    CancelOrder,
    PunchoutPaymentCallBack,
    GetUsablePaymentInfo,
    AddPreConfigurationToCart,
    GetAssignedPromotioncodeInfo,
    CsrCancelOrderOnBehalf,
    PreCheckout,
    UnlockCartOnBehalf,
    UpdateApplePayOrder,
    GetCart,
    UdpateOrderItem,
    CancelOrderInCart,
    GetPunchoutPaymentInfo,
    GetPaymentPolicyListDataBean,
    CreateOrder,
    GetUsableBillingAddressListTCDataBean,
    ProcessApplePayOrder,
    LockCart,
    GetUsableShipChargesByShipMode,
    ApplyPromotionCode,
} from './graphql/schema/hcl-commerce.cart.schema';
import { HCLCommerceBaseDatasourcePathParams, HCLCommerceBaseRestDatasource } from '@plugin-hcl-commerce/common';
import { RestDatasourceServiceDefinitions, HttpMethods, RestDatasourceServiceDefinition } from '@plugin-datasource-rest';

export const HCLCommerceCartDatasourcePathParams = {
    ...HCLCommerceBaseDatasourcePathParams,
    orderId: '{orderId}',
    initKey_referenceNumber: '{initKey_referenceNumber}',
    cartId: '{cartId}',
    buyerPurchaseOrderId: '{buyerPurchaseOrderId}',
    promoCode: '{promoCode}',
    couponId: '{couponId}',
    paymentInstruction_id: '{paymentInstruction_id}',
};

export interface HCLCommerceCartServiceDefinitions extends RestDatasourceServiceDefinitions {
    getShippingInfo: RestDatasourceServiceDefinition;
    updateOrderShippingInfo: RestDatasourceServiceDefinition;
    checkOut: RestDatasourceServiceDefinition;
    csrCancelOrder: RestDatasourceServiceDefinition;
    getAssignedCouponInfo: RestDatasourceServiceDefinition;
    applyCoupon: RestDatasourceServiceDefinition;
    getUsableShippingMode: RestDatasourceServiceDefinition;
    getPAttributeDataBean: RestDatasourceServiceDefinition;
    updateRewardOption: RestDatasourceServiceDefinition;
    calculateOrder: RestDatasourceServiceDefinition;
    getUsableShippingInfo: RestDatasourceServiceDefinition;
    setPendingOrder: RestDatasourceServiceDefinition;
    unlockCart: RestDatasourceServiceDefinition;
    getBuyerPurchaseOrderDataBean: RestDatasourceServiceDefinition;
    addConfigurationToCart: RestDatasourceServiceDefinition;
    copyOrder: RestDatasourceServiceDefinition;
    getAllowableShippingModes: RestDatasourceServiceDefinition;
    updateConfigurationInCart: RestDatasourceServiceDefinition;
    applyCheckoutProfile: RestDatasourceServiceDefinition;
    moveOrderItem: RestDatasourceServiceDefinition;
    repay: RestDatasourceServiceDefinition;
    removePromotionCode: RestDatasourceServiceDefinition;
    removeCoupon: RestDatasourceServiceDefinition;
    deleteOrderItem: RestDatasourceServiceDefinition;
    lockCartOnBehalf: RestDatasourceServiceDefinition;
    deletePaymentInstruction: RestDatasourceServiceDefinition;
    scheduleOrder: RestDatasourceServiceDefinition;
    addOrderItems: RestDatasourceServiceDefinition;
    cancelApplePayOrder: RestDatasourceServiceDefinition;
    getSensitiveDataMaskByPlainString: RestDatasourceServiceDefinition;
    getPaymentInfo: RestDatasourceServiceDefinition;
    updatePaymentInstruction: RestDatasourceServiceDefinition;
    addPaymentInstruction: RestDatasourceServiceDefinition;
    deleteAllPaymentInstructions: RestDatasourceServiceDefinition;
    orderItemDisplay: RestDatasourceServiceDefinition;
    updateOrderItems: RestDatasourceServiceDefinition;
    calculateOrderByOrderId: RestDatasourceServiceDefinition;
    fetchPaymentToken: RestDatasourceServiceDefinition;
    cancelOrder: RestDatasourceServiceDefinition;
    punchoutPaymentCallBack: RestDatasourceServiceDefinition;
    getUsablePaymentInfo: RestDatasourceServiceDefinition;
    addPreConfigurationToCart: RestDatasourceServiceDefinition;
    getAssignedPromotioncodeInfo: RestDatasourceServiceDefinition;
    applyPromotionCode: RestDatasourceServiceDefinition;
    csrCancelOrderOnBehalf: RestDatasourceServiceDefinition;
    preCheckout: RestDatasourceServiceDefinition;
    unlockCartOnBehalf: RestDatasourceServiceDefinition;
    updateApplePayOrder: RestDatasourceServiceDefinition;
    getCart: RestDatasourceServiceDefinition;
    udpateOrderItem: RestDatasourceServiceDefinition;
    cancelOrderInCart: RestDatasourceServiceDefinition;
    getPunchoutPaymentInfo: RestDatasourceServiceDefinition;
    getPaymentPolicyListDataBean: RestDatasourceServiceDefinition;
    createOrder: RestDatasourceServiceDefinition;
    getUsableBillingAddressListTCDataBean: RestDatasourceServiceDefinition;
    processApplePayOrder: RestDatasourceServiceDefinition;
    lockCart: RestDatasourceServiceDefinition;
    getUsableShipChargesByShipMode: RestDatasourceServiceDefinition;
}


export class HCLCommerceCartDatasource extends HCLCommerceBaseRestDatasource {
    protected readonly noCartError = 'Request failed with status code 404';

    protected serviceDefinitions: HCLCommerceCartServiceDefinitions = {
        getShippingInfo: {
            id: 'getShippingInfo',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/shipping_info`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateOrderShippingInfo: {
            id: 'updateOrderShippingInfo',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/shipping_info`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        checkOut: {
            id: 'checkOut',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/checkout`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        csrCancelOrder: {
            id: 'csrCancelOrder',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.orderId}/csrcancel_order`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getAssignedCouponInfo: {
            id: 'getAssignedCouponInfo',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/assigned_coupon`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        applyCoupon: {
            id: 'applyCoupon',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/assigned_coupon`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getUsableShippingMode: {
            id: 'getUsableShippingMode',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/usable_shipping_mode`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getPAttributeDataBean: {
            id: 'getPAttributeDataBean',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/pattribute/${HCLCommerceCartDatasourcePathParams.initKey_referenceNumber}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateRewardOption: {
            id: 'updateRewardOption',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/update_reward_option`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        calculateOrder: {
            id: 'calculateOrder',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/calculate`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getUsableShippingInfo: {
            id: 'getUsableShippingInfo',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/usable_shipping_info`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        setPendingOrder: {
            id: 'setPendingOrder',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.orderId}/set_pending_order`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        unlockCart: {
            id: 'unlockCart',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.cartId}/unlock`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getBuyerPurchaseOrderDataBean: {
            id: 'getBuyerPurchaseOrderDataBean',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/buyer_purchase_order/${HCLCommerceCartDatasourcePathParams.buyerPurchaseOrderId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        addConfigurationToCart: {
            id: 'addConfigurationToCart',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/add_configuration_to_cart`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        copyOrder: {
            id: 'copyOrder',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/copy_order`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getAllowableShippingModes: {
            id: 'getAllowableShippingModes',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/shipping_modes`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateConfigurationInCart: {
            id: 'updateConfigurationInCart',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/update_configuration_in_cart`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        applyCheckoutProfile: {
            id: 'applyCheckoutProfile',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/applyCheckoutProfile`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        moveOrderItem: {
            id: 'moveOrderItem',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/move_order_item`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        repay: {
            id: 'repay',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction/repay`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        removePromotionCode: {
            id: 'removePromotionCode',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/assigned_promotion_code/${HCLCommerceCartDatasourcePathParams.promoCode}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        removeCoupon: {
            id: 'removeCoupon',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/assigned_coupon/${HCLCommerceCartDatasourcePathParams.couponId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deleteOrderItem: {
            id: 'deleteOrderItem',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/delete_order_item`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        lockCartOnBehalf: {
            id: 'lockCartOnBehalf',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.cartId}/lockOnBehalf`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deletePaymentInstruction: {
            id: 'deletePaymentInstruction',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction/${HCLCommerceCartDatasourcePathParams.paymentInstruction_id}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        scheduleOrder: {
            id: 'scheduleOrder',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.orderId}/schedule_order`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        addOrderItems: {
            id: 'addOrderItems',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        cancelApplePayOrder: {
            id: 'cancelApplePayOrder',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/applepay_cancel`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getSensitiveDataMaskByPlainString: {
            id: 'getSensitiveDataMaskByPlainString',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction/sensitive_data_mask_by_plain_string`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getPaymentInfo: {
            id: 'getPaymentInfo',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updatePaymentInstruction: {
            id: 'updatePaymentInstruction',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        addPaymentInstruction: {
            id: 'addPaymentInstruction',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        deleteAllPaymentInstructions: {
            id: 'deleteAllPaymentInstructions',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        orderItemDisplay: {
            id: 'orderItemDisplay',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/renew_order_items`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateOrderItems: {
            id: 'updateOrderItems',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/update_order_item`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        calculateOrderByOrderId: {
            id: 'calculateOrderByOrderId',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.orderId}/calculate`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        fetchPaymentToken: {
            id: 'fetchPaymentToken',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction/payment_token`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        cancelOrder: {
            id: 'cancelOrder',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.orderId}/cancel_order`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        punchoutPaymentCallBack: {
            id: 'punchoutPaymentCallBack',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction/callback`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getUsablePaymentInfo: {
            id: 'getUsablePaymentInfo',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/usable_payment_info`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        addPreConfigurationToCart: {
            id: 'addPreConfigurationToCart',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/add_preconfiguration_to_cart`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getAssignedPromotioncodeInfo: {
            id: 'getAssignedPromotioncodeInfo',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/assigned_promotion_code`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        applyPromotionCode: {
            id: 'applyPromotionCode',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/assigned_promotion_code`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        csrCancelOrderOnBehalf: {
            id: 'csrCancelOrderOnBehalf',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.orderId}/csrcancel_order_onbehalf`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        preCheckout: {
            id: 'preCheckout',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/precheckout`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        unlockCartOnBehalf: {
            id: 'unlockCartOnBehalf',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.cartId}/unlockOnBehalf`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        updateApplePayOrder: {
            id: 'updateApplePayOrder',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/applepay_update`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getCart: {
            id: 'getCart',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 1,
                //ignoreStatuses: [401, 404]
            },
        },
        udpateOrderItem: {
            id: 'udpateOrderItem',
            method: HttpMethods.put,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        cancelOrderInCart: {
            id: 'cancelOrderInCart',
            method: HttpMethods.delete,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getPunchoutPaymentInfo: {
            id: 'getPunchoutPaymentInfo',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_instruction/punchoutPaymentInfo`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getPaymentPolicyListDataBean: {
            id: 'getPaymentPolicyListDataBean',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/payment_policy_list`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        createOrder: {
            id: 'createOrder',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/create_order`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getUsableBillingAddressListTCDataBean: {
            id: 'getUsableBillingAddressListTCDataBean',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/usable_billing_address/${HCLCommerceCartDatasourcePathParams.orderId}`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        processApplePayOrder: {
            id: 'processApplePayOrder',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/@self/applepay_process`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        lockCart: {
            id: 'lockCart',
            method: HttpMethods.post,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.cartId}/lock`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
        getUsableShipChargesByShipMode: {
            id: 'getUsableShipChargesByShipMode',
            method: HttpMethods.get,
            path: `store/${HCLCommerceCartDatasourcePathParams.storeId}/cart/${HCLCommerceCartDatasourcePathParams.orderId}/usable_ship_charges_by_ship_mode`,
            timeout: 5000,
            retryConfig: {
                maxAttempts: 5,
                ignoreStatuses: [401],
            },
        },
    };

    async getShippingInfo(
        requestContext: RequestContext,
        queryParams?: GetShippingInfo.Query,
        headers?: GetShippingInfo.Header,
    ): Promise<
        GetShippingInfo.Response._200 | GetShippingInfo.Response._400 | GetShippingInfo.Response._401 | GetShippingInfo.Response._403 | GetShippingInfo.Response._404 | GetShippingInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getShippingInfo`;

        let result:
            | GetShippingInfo.Response._200
            | GetShippingInfo.Response._400
            | GetShippingInfo.Response._401
            | GetShippingInfo.Response._403
            | GetShippingInfo.Response._404
            | GetShippingInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getShippingInfo, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getShippingInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateOrderShippingInfo(
        requestContext: RequestContext,
        body: UpdateOrderShippingInfo.Body,
        queryParams?: UpdateOrderShippingInfo.Query,
        headers?: UpdateOrderShippingInfo.Header,
    ): Promise<
        | UpdateOrderShippingInfo.Response._200
        | UpdateOrderShippingInfo.Response._400
        | UpdateOrderShippingInfo.Response._401
        | UpdateOrderShippingInfo.Response._403
        | UpdateOrderShippingInfo.Response._404
        | UpdateOrderShippingInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.updateOrderShippingInfo`;

        let result:
            | UpdateOrderShippingInfo.Response._200
            | UpdateOrderShippingInfo.Response._400
            | UpdateOrderShippingInfo.Response._401
            | UpdateOrderShippingInfo.Response._403
            | UpdateOrderShippingInfo.Response._404
            | UpdateOrderShippingInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateOrderShippingInfo, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateOrderShippingInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async checkOut(
        requestContext: RequestContext,
        body: CheckOut.Body,
        queryParams?: CheckOut.Query,
        headers?: CheckOut.Header,
    ): Promise<CheckOut.Response._200 | CheckOut.Response._400 | CheckOut.Response._401 | CheckOut.Response._403 | CheckOut.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.checkOut`;

        let result: CheckOut.Response._200 | CheckOut.Response._400 | CheckOut.Response._401 | CheckOut.Response._403 | CheckOut.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.checkOut, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [checkOut]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async csrCancelOrder(
        requestContext: RequestContext,
        orderId: string,
        body?: CsrCancelOrder.Body,
        queryParams?: CsrCancelOrder.Query,
        headers?: CsrCancelOrder.Header,
    ): Promise<CsrCancelOrder.Response._200 | CsrCancelOrder.Response._400 | CsrCancelOrder.Response._401 | CsrCancelOrder.Response._403 | CsrCancelOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.csrCancelOrder`;

        let result: CsrCancelOrder.Response._200 | CsrCancelOrder.Response._400 | CsrCancelOrder.Response._401 | CsrCancelOrder.Response._403 | CsrCancelOrder.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.csrCancelOrder, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [csrCancelOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getAssignedCouponInfo(
        requestContext: RequestContext,
        queryParams?: GetAssignedCouponInfo.Query,
        headers?: GetAssignedCouponInfo.Header,
    ): Promise<
        | GetAssignedCouponInfo.Response._200
        | GetAssignedCouponInfo.Response._400
        | GetAssignedCouponInfo.Response._401
        | GetAssignedCouponInfo.Response._403
        | GetAssignedCouponInfo.Response._404
        | GetAssignedCouponInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getAssignedCouponInfo`;

        let result:
            | GetAssignedCouponInfo.Response._200
            | GetAssignedCouponInfo.Response._400
            | GetAssignedCouponInfo.Response._401
            | GetAssignedCouponInfo.Response._403
            | GetAssignedCouponInfo.Response._404
            | GetAssignedCouponInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getAssignedCouponInfo, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getAssignedCouponInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async applyCoupon(
        requestContext: RequestContext,
        body: ApplyCoupon.Body,
        queryParams?: ApplyCoupon.Query,
        headers?: ApplyCoupon.Header,
    ): Promise<ApplyCoupon.Response._200 | ApplyCoupon.Response._201 | ApplyCoupon.Response._400 | ApplyCoupon.Response._401 | ApplyCoupon.Response._403 | ApplyCoupon.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.applyCoupon`;

        let result: ApplyCoupon.Response._200 | ApplyCoupon.Response._201 | ApplyCoupon.Response._400 | ApplyCoupon.Response._401 | ApplyCoupon.Response._403 | ApplyCoupon.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.applyCoupon, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [applyCoupon]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getUsableShippingMode(
        requestContext: RequestContext,
        queryParams?: GetUsableShippingMode.Query,
        headers?: GetUsableShippingMode.Header,
    ): Promise<
        | GetUsableShippingMode.Response._200
        | GetUsableShippingMode.Response._400
        | GetUsableShippingMode.Response._401
        | GetUsableShippingMode.Response._403
        | GetUsableShippingMode.Response._404
        | GetUsableShippingMode.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getUsableShippingMode`;

        let result:
            | GetUsableShippingMode.Response._200
            | GetUsableShippingMode.Response._400
            | GetUsableShippingMode.Response._401
            | GetUsableShippingMode.Response._403
            | GetUsableShippingMode.Response._404
            | GetUsableShippingMode.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getUsableShippingMode, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getUsableShippingMode]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getPAttributeDataBean(
        requestContext: RequestContext,
        initKey_referenceNumber: string,
        queryParams?: GetPAttributeDataBean.Query,
        headers?: GetPAttributeDataBean.Header,
    ): Promise<
        | GetPAttributeDataBean.Response._200
        | GetPAttributeDataBean.Response._400
        | GetPAttributeDataBean.Response._401
        | GetPAttributeDataBean.Response._403
        | GetPAttributeDataBean.Response._404
        | GetPAttributeDataBean.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getPAttributeDataBean`;

        let result:
            | GetPAttributeDataBean.Response._200
            | GetPAttributeDataBean.Response._400
            | GetPAttributeDataBean.Response._401
            | GetPAttributeDataBean.Response._403
            | GetPAttributeDataBean.Response._404
            | GetPAttributeDataBean.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.initKey_referenceNumber]: initKey_referenceNumber,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getPAttributeDataBean, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getPAttributeDataBean]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateRewardOption(
        requestContext: RequestContext,
        body: UpdateRewardOption.Body,
        queryParams?: UpdateRewardOption.Query,
        headers?: UpdateRewardOption.Header,
    ): Promise<UpdateRewardOption.Response._200 | UpdateRewardOption.Response._400 | UpdateRewardOption.Response._401 | UpdateRewardOption.Response._403 | UpdateRewardOption.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.updateRewardOption`;

        let result: UpdateRewardOption.Response._200 | UpdateRewardOption.Response._400 | UpdateRewardOption.Response._401 | UpdateRewardOption.Response._403 | UpdateRewardOption.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateRewardOption, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateRewardOption]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async calculateOrder(
        requestContext: RequestContext,
        body: CalculateOrder.Body,
        queryParams?: CalculateOrder.Query,
        headers?: CalculateOrder.Header,
    ): Promise<CalculateOrder.Response._200 | CalculateOrder.Response._400 | CalculateOrder.Response._401 | CalculateOrder.Response._403 | CalculateOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.calculateOrder`;

        let result: CalculateOrder.Response._200 | CalculateOrder.Response._400 | CalculateOrder.Response._401 | CalculateOrder.Response._403 | CalculateOrder.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.calculateOrder, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [calculateOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getUsableShippingInfo(
        requestContext: RequestContext,
        queryParams?: GetUsableShippingInfo.Query,
        headers?: GetUsableShippingInfo.Header,
    ): Promise<
        | GetUsableShippingInfo.Response._200
        | GetUsableShippingInfo.Response._400
        | GetUsableShippingInfo.Response._401
        | GetUsableShippingInfo.Response._403
        | GetUsableShippingInfo.Response._404
        | GetUsableShippingInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getUsableShippingInfo`;

        let result:
            | GetUsableShippingInfo.Response._200
            | GetUsableShippingInfo.Response._400
            | GetUsableShippingInfo.Response._401
            | GetUsableShippingInfo.Response._403
            | GetUsableShippingInfo.Response._404
            | GetUsableShippingInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getUsableShippingInfo, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getUsableShippingInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async setPendingOrder(
        requestContext: RequestContext,
        orderId: string,
        body: SetPendingOrder.Body,
        queryParams?: SetPendingOrder.Query,
        headers?: SetPendingOrder.Header,
    ): Promise<SetPendingOrder.Response._200 | SetPendingOrder.Response._400 | SetPendingOrder.Response._401 | SetPendingOrder.Response._403 | SetPendingOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.setPendingOrder`;

        let result: SetPendingOrder.Response._200 | SetPendingOrder.Response._400 | SetPendingOrder.Response._401 | SetPendingOrder.Response._403 | SetPendingOrder.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.setPendingOrder, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [setPendingOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async unlockCart(
        requestContext: RequestContext,
        cartId: string,
        body: UnlockCart.Body,
        queryParams?: UnlockCart.Query,
        headers?: UnlockCart.Header,
    ): Promise<UnlockCart.Response._200 | UnlockCart.Response._400 | UnlockCart.Response._401 | UnlockCart.Response._403 | UnlockCart.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.unlockCart`;

        let result: UnlockCart.Response._200 | UnlockCart.Response._400 | UnlockCart.Response._401 | UnlockCart.Response._403 | UnlockCart.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.cartId]: cartId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.unlockCart, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [unlockCart]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getBuyerPurchaseOrderDataBean(
        requestContext: RequestContext,
        buyerPurchaseOrderId: string,
        queryParams?: GetBuyerPurchaseOrderDataBean.Query,
        headers?: GetBuyerPurchaseOrderDataBean.Header,
    ): Promise<
        | GetBuyerPurchaseOrderDataBean.Response._200
        | GetBuyerPurchaseOrderDataBean.Response._400
        | GetBuyerPurchaseOrderDataBean.Response._401
        | GetBuyerPurchaseOrderDataBean.Response._403
        | GetBuyerPurchaseOrderDataBean.Response._404
        | GetBuyerPurchaseOrderDataBean.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getBuyerPurchaseOrderDataBean`;

        let result:
            | GetBuyerPurchaseOrderDataBean.Response._200
            | GetBuyerPurchaseOrderDataBean.Response._400
            | GetBuyerPurchaseOrderDataBean.Response._401
            | GetBuyerPurchaseOrderDataBean.Response._403
            | GetBuyerPurchaseOrderDataBean.Response._404
            | GetBuyerPurchaseOrderDataBean.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.buyerPurchaseOrderId]: buyerPurchaseOrderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getBuyerPurchaseOrderDataBean, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getBuyerPurchaseOrderDataBean]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async addConfigurationToCart(
        requestContext: RequestContext,
        body: AddConfigurationToCart.Body,
        queryParams?: AddConfigurationToCart.Query,
        headers?: AddConfigurationToCart.Header,
    ): Promise<
        AddConfigurationToCart.Response._200 | AddConfigurationToCart.Response._400 | AddConfigurationToCart.Response._401 | AddConfigurationToCart.Response._403 | AddConfigurationToCart.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.addConfigurationToCart`;

        let result:
            | AddConfigurationToCart.Response._200
            | AddConfigurationToCart.Response._400
            | AddConfigurationToCart.Response._401
            | AddConfigurationToCart.Response._403
            | AddConfigurationToCart.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.addConfigurationToCart, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [addConfigurationToCart]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async copyOrder(
        requestContext: RequestContext,
        body: CopyOrder.Body,
        queryParams?: CopyOrder.Query,
        headers?: CopyOrder.Header,
    ): Promise<CopyOrder.Response._200 | CopyOrder.Response._400 | CopyOrder.Response._401 | CopyOrder.Response._403 | CopyOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.copyOrder`;

        let result: CopyOrder.Response._200 | CopyOrder.Response._400 | CopyOrder.Response._401 | CopyOrder.Response._403 | CopyOrder.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.copyOrder, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [copyOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getAllowableShippingModes(
        requestContext: RequestContext,
        queryParams?: GetAllowableShippingModes.Query,
        headers?: GetAllowableShippingModes.Header,
    ): Promise<
        | GetAllowableShippingModes.Response._200
        | GetAllowableShippingModes.Response._400
        | GetAllowableShippingModes.Response._401
        | GetAllowableShippingModes.Response._403
        | GetAllowableShippingModes.Response._404
        | GetAllowableShippingModes.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getAllowableShippingModes`;

        let result:
            | GetAllowableShippingModes.Response._200
            | GetAllowableShippingModes.Response._400
            | GetAllowableShippingModes.Response._401
            | GetAllowableShippingModes.Response._403
            | GetAllowableShippingModes.Response._404
            | GetAllowableShippingModes.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getAllowableShippingModes, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getAllowableShippingModes]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateConfigurationInCart(
        requestContext: RequestContext,
        body: UpdateConfigurationInCart.Body,
        queryParams?: UpdateConfigurationInCart.Query,
        headers?: UpdateConfigurationInCart.Header,
    ): Promise<
        | UpdateConfigurationInCart.Response._200
        | UpdateConfigurationInCart.Response._400
        | UpdateConfigurationInCart.Response._401
        | UpdateConfigurationInCart.Response._403
        | UpdateConfigurationInCart.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.updateConfigurationInCart`;

        let result:
            | UpdateConfigurationInCart.Response._200
            | UpdateConfigurationInCart.Response._400
            | UpdateConfigurationInCart.Response._401
            | UpdateConfigurationInCart.Response._403
            | UpdateConfigurationInCart.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateConfigurationInCart, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateConfigurationInCart]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async applyCheckoutProfile(
        requestContext: RequestContext,
        body: ApplyCheckoutProfile.Body,
        queryParams?: ApplyCheckoutProfile.Query,
        headers?: ApplyCheckoutProfile.Header,
    ): Promise<ApplyCheckoutProfile.Response._200 | ApplyCheckoutProfile.Response._400 | ApplyCheckoutProfile.Response._401 | ApplyCheckoutProfile.Response._403 | ApplyCheckoutProfile.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.applyCheckoutProfile`;

        let result:
            | ApplyCheckoutProfile.Response._200
            | ApplyCheckoutProfile.Response._400
            | ApplyCheckoutProfile.Response._401
            | ApplyCheckoutProfile.Response._403
            | ApplyCheckoutProfile.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.applyCheckoutProfile, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [applyCheckoutProfile]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async moveOrderItem(
        requestContext: RequestContext,
        body: MoveOrderItem.Body,
        queryParams?: MoveOrderItem.Query,
        headers?: MoveOrderItem.Header,
    ): Promise<MoveOrderItem.Response._200 | MoveOrderItem.Response._400 | MoveOrderItem.Response._401 | MoveOrderItem.Response._403 | MoveOrderItem.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.moveOrderItem`;

        let result: MoveOrderItem.Response._200 | MoveOrderItem.Response._400 | MoveOrderItem.Response._401 | MoveOrderItem.Response._403 | MoveOrderItem.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.moveOrderItem, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [moveOrderItem]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async repay(
        requestContext: RequestContext,
        body: Repay.Body,
        queryParams?: Repay.Query,
        headers?: Repay.Header,
    ): Promise<Repay.Response._200 | Repay.Response._400 | Repay.Response._401 | Repay.Response._403 | Repay.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.repay`;

        let result: Repay.Response._200 | Repay.Response._400 | Repay.Response._401 | Repay.Response._403 | Repay.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.repay, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [repay]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async removePromotionCode(
        requestContext: RequestContext,
        promoCode: string,
        body?: RemovePromotionCode.Body,
        queryParams?: RemovePromotionCode.Query,
        headers?: RemovePromotionCode.Header,
    ): Promise<RemovePromotionCode.Response._200 | RemovePromotionCode.Response._400 | RemovePromotionCode.Response._401 | RemovePromotionCode.Response._403 | RemovePromotionCode.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.removePromotionCode`;

        let result: RemovePromotionCode.Response._200 | RemovePromotionCode.Response._400 | RemovePromotionCode.Response._401 | RemovePromotionCode.Response._403 | RemovePromotionCode.Response._500 =
            null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.promoCode]: promoCode,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.removePromotionCode, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [removePromotionCode]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async removeCoupon(
        requestContext: RequestContext,
        couponId: string,
        body?: RemoveCoupon.Body,
        queryParams?: RemoveCoupon.Query,
        headers?: RemoveCoupon.Header,
    ): Promise<RemoveCoupon.Response._200 | RemoveCoupon.Response._400 | RemoveCoupon.Response._401 | RemoveCoupon.Response._403 | RemoveCoupon.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.removeCoupon`;

        let result: RemoveCoupon.Response._200 | RemoveCoupon.Response._400 | RemoveCoupon.Response._401 | RemoveCoupon.Response._403 | RemoveCoupon.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.couponId]: couponId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.removeCoupon, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [removeCoupon]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deleteOrderItem(
        requestContext: RequestContext,
        body: DeleteOrderItem.Body,
        queryParams?: DeleteOrderItem.Query,
        headers?: DeleteOrderItem.Header,
    ): Promise<DeleteOrderItem.Response._200 | DeleteOrderItem.Response._400 | DeleteOrderItem.Response._401 | DeleteOrderItem.Response._403 | DeleteOrderItem.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.deleteOrderItem`;

        let result: DeleteOrderItem.Response._200 | DeleteOrderItem.Response._400 | DeleteOrderItem.Response._401 | DeleteOrderItem.Response._403 | DeleteOrderItem.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deleteOrderItem, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deleteOrderItem]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async lockCartOnBehalf(
        requestContext: RequestContext,
        cartId: string,
        body: LockCartOnBehalf.Body,
        queryParams?: LockCartOnBehalf.Query,
        headers?: LockCartOnBehalf.Header,
    ): Promise<LockCartOnBehalf.Response._200 | LockCartOnBehalf.Response._400 | LockCartOnBehalf.Response._401 | LockCartOnBehalf.Response._403 | LockCartOnBehalf.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.lockCartOnBehalf`;

        let result: LockCartOnBehalf.Response._200 | LockCartOnBehalf.Response._400 | LockCartOnBehalf.Response._401 | LockCartOnBehalf.Response._403 | LockCartOnBehalf.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.cartId]: cartId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.lockCartOnBehalf, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [lockCartOnBehalf]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deletePaymentInstruction(
        requestContext: RequestContext,
        paymentInstruction_id: string,
        body?: DeletePaymentInstruction.Body,
        queryParams?: DeletePaymentInstruction.Query,
        headers?: DeletePaymentInstruction.Header,
    ): Promise<
        | DeletePaymentInstruction.Response._200
        | DeletePaymentInstruction.Response._400
        | DeletePaymentInstruction.Response._401
        | DeletePaymentInstruction.Response._403
        | DeletePaymentInstruction.Response._404
        | DeletePaymentInstruction.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.deletePaymentInstruction`;

        let result:
            | DeletePaymentInstruction.Response._200
            | DeletePaymentInstruction.Response._400
            | DeletePaymentInstruction.Response._401
            | DeletePaymentInstruction.Response._403
            | DeletePaymentInstruction.Response._404
            | DeletePaymentInstruction.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.paymentInstruction_id]: paymentInstruction_id,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deletePaymentInstruction, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deletePaymentInstruction]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async scheduleOrder(
        requestContext: RequestContext,
        orderId: string,
        body: ScheduleOrder.Body,
        queryParams?: ScheduleOrder.Query,
        headers?: ScheduleOrder.Header,
    ): Promise<ScheduleOrder.Response._200 | ScheduleOrder.Response._400 | ScheduleOrder.Response._401 | ScheduleOrder.Response._403 | ScheduleOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.scheduleOrder`;

        let result: ScheduleOrder.Response._200 | ScheduleOrder.Response._400 | ScheduleOrder.Response._401 | ScheduleOrder.Response._403 | ScheduleOrder.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.scheduleOrder, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [scheduleOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async addOrderItems(
        requestContext: RequestContext,
        body: AddOrderItem.Body,
        queryParams?: AddOrderItem.Query,
        headers?: AddOrderItem.Header,
    ): Promise<AddOrderItem.Response._200 | AddOrderItem.Response._201 | AddOrderItem.Response._400 | AddOrderItem.Response._401 | AddOrderItem.Response._403 | AddOrderItem.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.addOrderItem`;

        let result: AddOrderItem.Response._200 | AddOrderItem.Response._201 | AddOrderItem.Response._400 | AddOrderItem.Response._401 | AddOrderItem.Response._403 | AddOrderItem.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.addOrderItems, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [addOrderItem]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async cancelApplePayOrder(
        requestContext: RequestContext,
        body: CancelApplePayOrder.Body,
        queryParams?: CancelApplePayOrder.Query,
        headers?: CancelApplePayOrder.Header,
    ): Promise<CancelApplePayOrder.Response._200 | CancelApplePayOrder.Response._400 | CancelApplePayOrder.Response._401 | CancelApplePayOrder.Response._403 | CancelApplePayOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.cancelApplePayOrder`;

        let result: CancelApplePayOrder.Response._200 | CancelApplePayOrder.Response._400 | CancelApplePayOrder.Response._401 | CancelApplePayOrder.Response._403 | CancelApplePayOrder.Response._500 =
            null;

        try {
            {
            }
            result = await this.execute(requestContext, this.serviceDefinitions.cancelApplePayOrder, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [cancelApplePayOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getSensitiveDataMaskByPlainString(
        requestContext: RequestContext,
        queryParams?: GetSensitiveDataMaskByPlainString.Query,
        headers?: GetSensitiveDataMaskByPlainString.Header,
    ): Promise<
        | GetSensitiveDataMaskByPlainString.Response._200
        | GetSensitiveDataMaskByPlainString.Response._400
        | GetSensitiveDataMaskByPlainString.Response._401
        | GetSensitiveDataMaskByPlainString.Response._403
        | GetSensitiveDataMaskByPlainString.Response._404
        | GetSensitiveDataMaskByPlainString.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getSensitiveDataMaskByPlainString`;

        let result:
            | GetSensitiveDataMaskByPlainString.Response._200
            | GetSensitiveDataMaskByPlainString.Response._400
            | GetSensitiveDataMaskByPlainString.Response._401
            | GetSensitiveDataMaskByPlainString.Response._403
            | GetSensitiveDataMaskByPlainString.Response._404
            | GetSensitiveDataMaskByPlainString.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getSensitiveDataMaskByPlainString, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getSensitiveDataMaskByPlainString]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getPaymentInfo(
        requestContext: RequestContext,
        queryParams?: GetPaymentInfo.Query,
        headers?: GetPaymentInfo.Header,
    ): Promise<
        GetPaymentInfo.Response._200 | GetPaymentInfo.Response._400 | GetPaymentInfo.Response._401 | GetPaymentInfo.Response._403 | GetPaymentInfo.Response._404 | GetPaymentInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getPaymentInfo`;

        let result:
            | GetPaymentInfo.Response._200
            | GetPaymentInfo.Response._400
            | GetPaymentInfo.Response._401
            | GetPaymentInfo.Response._403
            | GetPaymentInfo.Response._404
            | GetPaymentInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getPaymentInfo, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getPaymentInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updatePaymentInstruction(
        requestContext: RequestContext,
        body: UpdatePaymentInstruction.Body,
        queryParams?: UpdatePaymentInstruction.Query,
        headers?: UpdatePaymentInstruction.Header,
    ): Promise<
        | UpdatePaymentInstruction.Response._200
        | UpdatePaymentInstruction.Response._400
        | UpdatePaymentInstruction.Response._401
        | UpdatePaymentInstruction.Response._403
        | UpdatePaymentInstruction.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.updatePaymentInstruction`;

        let result:
            | UpdatePaymentInstruction.Response._200
            | UpdatePaymentInstruction.Response._400
            | UpdatePaymentInstruction.Response._401
            | UpdatePaymentInstruction.Response._403
            | UpdatePaymentInstruction.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updatePaymentInstruction, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updatePaymentInstruction]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async addPaymentInstruction(
        requestContext: RequestContext,
        body: AddPaymentInstruction.Body,
        queryParams?: AddPaymentInstruction.Query,
        headers?: AddPaymentInstruction.Header,
    ): Promise<
        | AddPaymentInstruction.Response._200
        | AddPaymentInstruction.Response._201
        | AddPaymentInstruction.Response._400
        | AddPaymentInstruction.Response._401
        | AddPaymentInstruction.Response._403
        | AddPaymentInstruction.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.addPaymentInstruction`;

        let result:
            | AddPaymentInstruction.Response._200
            | AddPaymentInstruction.Response._201
            | AddPaymentInstruction.Response._400
            | AddPaymentInstruction.Response._401
            | AddPaymentInstruction.Response._403
            | AddPaymentInstruction.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.addPaymentInstruction, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [addPaymentInstruction]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async deleteAllPaymentInstructions(
        requestContext: RequestContext,
        body?: DeleteAllPaymentInstructions.Body,
        queryParams?: DeleteAllPaymentInstructions.Query,
        headers?: DeleteAllPaymentInstructions.Header,
    ): Promise<
        | DeleteAllPaymentInstructions.Response._200
        | DeleteAllPaymentInstructions.Response._400
        | DeleteAllPaymentInstructions.Response._401
        | DeleteAllPaymentInstructions.Response._403
        | DeleteAllPaymentInstructions.Response._404
        | DeleteAllPaymentInstructions.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.deleteAllPaymentInstructions`;

        let result:
            | DeleteAllPaymentInstructions.Response._200
            | DeleteAllPaymentInstructions.Response._400
            | DeleteAllPaymentInstructions.Response._401
            | DeleteAllPaymentInstructions.Response._403
            | DeleteAllPaymentInstructions.Response._404
            | DeleteAllPaymentInstructions.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.deleteAllPaymentInstructions, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [deleteAllPaymentInstructions]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async orderItemDisplay(
        requestContext: RequestContext,
        body: OrderItemDisplay.Body,
        queryParams?: OrderItemDisplay.Query,
        headers?: OrderItemDisplay.Header,
    ): Promise<OrderItemDisplay.Response._200 | OrderItemDisplay.Response._400 | OrderItemDisplay.Response._401 | OrderItemDisplay.Response._403 | OrderItemDisplay.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.orderItemDisplay`;

        let result: OrderItemDisplay.Response._200 | OrderItemDisplay.Response._400 | OrderItemDisplay.Response._401 | OrderItemDisplay.Response._403 | OrderItemDisplay.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.orderItemDisplay, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [orderItemDisplay]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateOrderItems(
        requestContext: RequestContext,
        body: UpdateOrderItem.Body,
        queryParams?: UpdateOrderItem.Query,
        headers?: UpdateOrderItem.Header,
    ): Promise<UpdateOrderItem.Response._200 | UpdateOrderItem.Response._400 | UpdateOrderItem.Response._401 | UpdateOrderItem.Response._403 | UpdateOrderItem.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.updateOrderItem`;

        let result: UpdateOrderItem.Response._200 | UpdateOrderItem.Response._400 | UpdateOrderItem.Response._401 | UpdateOrderItem.Response._403 | UpdateOrderItem.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateOrderItems, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateOrderItems]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async calculateOrderByOrderId(
        requestContext: RequestContext,
        orderId: string,
        body: CalculateOrderByOrderId.Body,
        queryParams?: CalculateOrderByOrderId.Query,
        headers?: CalculateOrderByOrderId.Header,
    ): Promise<
        | CalculateOrderByOrderId.Response._200
        | CalculateOrderByOrderId.Response._400
        | CalculateOrderByOrderId.Response._401
        | CalculateOrderByOrderId.Response._403
        | CalculateOrderByOrderId.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.calculateOrderByOrderId`;

        let result:
            | CalculateOrderByOrderId.Response._200
            | CalculateOrderByOrderId.Response._400
            | CalculateOrderByOrderId.Response._401
            | CalculateOrderByOrderId.Response._403
            | CalculateOrderByOrderId.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.calculateOrderByOrderId, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [calculateOrderByOrderId]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async fetchPaymentToken(
        requestContext: RequestContext,
        queryParams?: FetchPaymentToken.Query,
        headers?: FetchPaymentToken.Header,
    ): Promise<FetchPaymentToken.Response._200 | FetchPaymentToken.Response._400 | FetchPaymentToken.Response._401 | FetchPaymentToken.Response._403 | FetchPaymentToken.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.fetchPaymentToken`;

        let result: FetchPaymentToken.Response._200 | FetchPaymentToken.Response._400 | FetchPaymentToken.Response._401 | FetchPaymentToken.Response._403 | FetchPaymentToken.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.fetchPaymentToken, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [fetchPaymentToken]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async cancelOrder(
        requestContext: RequestContext,
        orderId: string,
        body?: CancelOrder.Body,
        queryParams?: CancelOrder.Query,
        headers?: CancelOrder.Header,
    ): Promise<CancelOrder.Response._200 | CancelOrder.Response._400 | CancelOrder.Response._401 | CancelOrder.Response._403 | CancelOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.cancelOrder`;

        let result: CancelOrder.Response._200 | CancelOrder.Response._400 | CancelOrder.Response._401 | CancelOrder.Response._403 | CancelOrder.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.cancelOrder, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [cancelOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async punchoutPaymentCallBack(
        requestContext: RequestContext,
        body: PunchoutPaymentCallBack.Body,
        queryParams?: PunchoutPaymentCallBack.Query,
        headers?: PunchoutPaymentCallBack.Header,
    ): Promise<
        | PunchoutPaymentCallBack.Response._200
        | PunchoutPaymentCallBack.Response._400
        | PunchoutPaymentCallBack.Response._401
        | PunchoutPaymentCallBack.Response._403
        | PunchoutPaymentCallBack.Response._404
        | PunchoutPaymentCallBack.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.punchoutPaymentCallBack`;

        let result:
            | PunchoutPaymentCallBack.Response._200
            | PunchoutPaymentCallBack.Response._400
            | PunchoutPaymentCallBack.Response._401
            | PunchoutPaymentCallBack.Response._403
            | PunchoutPaymentCallBack.Response._404
            | PunchoutPaymentCallBack.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.punchoutPaymentCallBack, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [punchoutPaymentCallBack]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getUsablePaymentInfo(
        requestContext: RequestContext,
        queryParams?: GetUsablePaymentInfo.Query,
        headers?: GetUsablePaymentInfo.Header,
    ): Promise<
        | GetUsablePaymentInfo.Response._200
        | GetUsablePaymentInfo.Response._400
        | GetUsablePaymentInfo.Response._401
        | GetUsablePaymentInfo.Response._403
        | GetUsablePaymentInfo.Response._404
        | GetUsablePaymentInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getUsablePaymentInfo`;

        let result:
            | GetUsablePaymentInfo.Response._200
            | GetUsablePaymentInfo.Response._400
            | GetUsablePaymentInfo.Response._401
            | GetUsablePaymentInfo.Response._403
            | GetUsablePaymentInfo.Response._404
            | GetUsablePaymentInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getUsablePaymentInfo, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getUsablePaymentInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async addPreConfigurationToCart(
        requestContext: RequestContext,
        body: AddPreConfigurationToCart.Body,
        queryParams?: AddPreConfigurationToCart.Query,
        headers?: AddPreConfigurationToCart.Header,
    ): Promise<
        | AddPreConfigurationToCart.Response._200
        | AddPreConfigurationToCart.Response._400
        | AddPreConfigurationToCart.Response._401
        | AddPreConfigurationToCart.Response._403
        | AddPreConfigurationToCart.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.addPreConfigurationToCart`;

        let result:
            | AddPreConfigurationToCart.Response._200
            | AddPreConfigurationToCart.Response._400
            | AddPreConfigurationToCart.Response._401
            | AddPreConfigurationToCart.Response._403
            | AddPreConfigurationToCart.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.addPreConfigurationToCart, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [addPreConfigurationToCart]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getAssignedPromotioncodeInfo(
        requestContext: RequestContext,
        queryParams?: GetAssignedPromotioncodeInfo.Query,
        headers?: GetAssignedPromotioncodeInfo.Header,
    ): Promise<
        | GetAssignedPromotioncodeInfo.Response._200
        | GetAssignedPromotioncodeInfo.Response._400
        | GetAssignedPromotioncodeInfo.Response._401
        | GetAssignedPromotioncodeInfo.Response._403
        | GetAssignedPromotioncodeInfo.Response._404
        | GetAssignedPromotioncodeInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getAssignedPromotioncodeInfo`;

        let result:
            | GetAssignedPromotioncodeInfo.Response._200
            | GetAssignedPromotioncodeInfo.Response._400
            | GetAssignedPromotioncodeInfo.Response._401
            | GetAssignedPromotioncodeInfo.Response._403
            | GetAssignedPromotioncodeInfo.Response._404
            | GetAssignedPromotioncodeInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getAssignedPromotioncodeInfo, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getAssignedPromotioncodeInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async applyPromotionCode(
        requestContext: RequestContext,
        body: ApplyPromotionCode.Body,
        queryParams?: ApplyPromotionCode.Query,
        headers?: ApplyPromotionCode.Header,
    ): Promise<
        | ApplyPromotionCode.Response._200
        | ApplyPromotionCode.Response._201
        | ApplyPromotionCode.Response._400
        | ApplyPromotionCode.Response._401
        | ApplyPromotionCode.Response._403
        | ApplyPromotionCode.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.applyPromotionCode`;

        let result:
            | ApplyPromotionCode.Response._200
            | ApplyPromotionCode.Response._201
            | ApplyPromotionCode.Response._400
            | ApplyPromotionCode.Response._401
            | ApplyPromotionCode.Response._403
            | ApplyPromotionCode.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.applyPromotionCode, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [applyPromotioncode]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async csrCancelOrderOnBehalf(
        requestContext: RequestContext,
        orderId: string,
        body?: CsrCancelOrderOnBehalf.Body,
        queryParams?: CsrCancelOrderOnBehalf.Query,
        headers?: CsrCancelOrderOnBehalf.Header,
    ): Promise<
        CsrCancelOrderOnBehalf.Response._200 | CsrCancelOrderOnBehalf.Response._400 | CsrCancelOrderOnBehalf.Response._401 | CsrCancelOrderOnBehalf.Response._403 | CsrCancelOrderOnBehalf.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.csrCancelOrderOnBehalf`;

        let result:
            | CsrCancelOrderOnBehalf.Response._200
            | CsrCancelOrderOnBehalf.Response._400
            | CsrCancelOrderOnBehalf.Response._401
            | CsrCancelOrderOnBehalf.Response._403
            | CsrCancelOrderOnBehalf.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.csrCancelOrderOnBehalf, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [csrCancelOrderOnBehalf]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async preCheckout(
        requestContext: RequestContext,
        body: PreCheckout.Body,
        queryParams?: PreCheckout.Query,
        headers?: PreCheckout.Header,
    ): Promise<PreCheckout.Response._200 | PreCheckout.Response._400 | PreCheckout.Response._401 | PreCheckout.Response._403 | PreCheckout.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.preCheckout`;

        let result: PreCheckout.Response._200 | PreCheckout.Response._400 | PreCheckout.Response._401 | PreCheckout.Response._403 | PreCheckout.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.preCheckout, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [preCheckout]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async unlockCartOnBehalf(
        requestContext: RequestContext,
        cartId: string,
        body: UnlockCartOnBehalf.Body,
        queryParams?: UnlockCartOnBehalf.Query,
        headers?: UnlockCartOnBehalf.Header,
    ): Promise<UnlockCartOnBehalf.Response._200 | UnlockCartOnBehalf.Response._400 | UnlockCartOnBehalf.Response._401 | UnlockCartOnBehalf.Response._403 | UnlockCartOnBehalf.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.unlockCartOnBehalf`;

        let result: UnlockCartOnBehalf.Response._200 | UnlockCartOnBehalf.Response._400 | UnlockCartOnBehalf.Response._401 | UnlockCartOnBehalf.Response._403 | UnlockCartOnBehalf.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.cartId]: cartId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.unlockCartOnBehalf, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [unlockCartOnBehalf]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async updateApplePayOrder(
        requestContext: RequestContext,
        body: UpdateApplePayOrder.Body,
        queryParams?: UpdateApplePayOrder.Query,
        headers?: UpdateApplePayOrder.Header,
    ): Promise<UpdateApplePayOrder.Response._200 | UpdateApplePayOrder.Response._400 | UpdateApplePayOrder.Response._401 | UpdateApplePayOrder.Response._403 | UpdateApplePayOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.updateApplePayOrder`;

        let result: UpdateApplePayOrder.Response._200 | UpdateApplePayOrder.Response._400 | UpdateApplePayOrder.Response._401 | UpdateApplePayOrder.Response._403 | UpdateApplePayOrder.Response._500 =
            null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.updateApplePayOrder, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [updateApplePayOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getCart(
        requestContext: RequestContext,
        queryParams?: GetCart.Query,
        headers?: GetCart.Header,
    ): Promise<any> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getCart`;

        let result: any = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getCart, queryParams, headers, {});
        } catch (error) {
            if (this.noCartError != error.message) {
                this.logger.info(`${methodname} - Error Executing [getCart]: ${error}`, requestContext);
                throw error;
            }
        }

        return result;
    }

    async udpateOrderItem(
        requestContext: RequestContext,
        body: UdpateOrderItem.Body,
        queryParams?: UdpateOrderItem.Query,
        headers?: UdpateOrderItem.Header,
    ): Promise<UdpateOrderItem.Response._200 | UdpateOrderItem.Response._400 | UdpateOrderItem.Response._401 | UdpateOrderItem.Response._403 | UdpateOrderItem.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.udpateOrderItem`;

        let result: UdpateOrderItem.Response._200 | UdpateOrderItem.Response._400 | UdpateOrderItem.Response._401 | UdpateOrderItem.Response._403 | UdpateOrderItem.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.udpateOrderItem, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [udpateOrderItem]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async cancelOrderInCart(
        requestContext: RequestContext,
        body?: CancelOrderInCart.Body,
        queryParams?: CancelOrderInCart.Query,
        headers?: CancelOrderInCart.Header,
    ): Promise<
        | CancelOrderInCart.Response._200
        | CancelOrderInCart.Response._204
        | CancelOrderInCart.Response._400
        | CancelOrderInCart.Response._401
        | CancelOrderInCart.Response._403
        | CancelOrderInCart.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.cancelOrderInCart`;

        let result:
            | CancelOrderInCart.Response._200
            | CancelOrderInCart.Response._204
            | CancelOrderInCart.Response._400
            | CancelOrderInCart.Response._401
            | CancelOrderInCart.Response._403
            | CancelOrderInCart.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.cancelOrderInCart, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [cancelOrderInCart]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getPunchoutPaymentInfo(
        requestContext: RequestContext,
        queryParams?: GetPunchoutPaymentInfo.Query,
        headers?: GetPunchoutPaymentInfo.Header,
    ): Promise<
        | GetPunchoutPaymentInfo.Response._200
        | GetPunchoutPaymentInfo.Response._400
        | GetPunchoutPaymentInfo.Response._401
        | GetPunchoutPaymentInfo.Response._403
        | GetPunchoutPaymentInfo.Response._404
        | GetPunchoutPaymentInfo.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getPunchoutPaymentInfo`;

        let result:
            | GetPunchoutPaymentInfo.Response._200
            | GetPunchoutPaymentInfo.Response._400
            | GetPunchoutPaymentInfo.Response._401
            | GetPunchoutPaymentInfo.Response._403
            | GetPunchoutPaymentInfo.Response._404
            | GetPunchoutPaymentInfo.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getPunchoutPaymentInfo, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getPunchoutPaymentInfo]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getPaymentPolicyListDataBean(
        requestContext: RequestContext,
        queryParams?: GetPaymentPolicyListDataBean.Query,
        headers?: GetPaymentPolicyListDataBean.Header,
    ): Promise<
        | GetPaymentPolicyListDataBean.Response._200
        | GetPaymentPolicyListDataBean.Response._400
        | GetPaymentPolicyListDataBean.Response._401
        | GetPaymentPolicyListDataBean.Response._403
        | GetPaymentPolicyListDataBean.Response._404
        | GetPaymentPolicyListDataBean.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getPaymentPolicyListDataBean`;

        let result:
            | GetPaymentPolicyListDataBean.Response._200
            | GetPaymentPolicyListDataBean.Response._400
            | GetPaymentPolicyListDataBean.Response._401
            | GetPaymentPolicyListDataBean.Response._403
            | GetPaymentPolicyListDataBean.Response._404
            | GetPaymentPolicyListDataBean.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getPaymentPolicyListDataBean, queryParams, headers, {});
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getPaymentPolicyListDataBean]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async createOrder(
        requestContext: RequestContext,
        body: CreateOrder.Body,
        queryParams?: CreateOrder.Query,
        headers?: CreateOrder.Header,
    ): Promise<CreateOrder.Response._200 | CreateOrder.Response._400 | CreateOrder.Response._401 | CreateOrder.Response._403 | CreateOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.createOrder`;

        let result: CreateOrder.Response._200 | CreateOrder.Response._400 | CreateOrder.Response._401 | CreateOrder.Response._403 | CreateOrder.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.createOrder, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [createOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getUsableBillingAddressListTCDataBean(
        requestContext: RequestContext,
        orderId: string,
        queryParams?: GetUsableBillingAddressListTCDataBean.Query,
        headers?: GetUsableBillingAddressListTCDataBean.Header,
    ): Promise<
        | GetUsableBillingAddressListTCDataBean.Response._200
        | GetUsableBillingAddressListTCDataBean.Response._400
        | GetUsableBillingAddressListTCDataBean.Response._401
        | GetUsableBillingAddressListTCDataBean.Response._403
        | GetUsableBillingAddressListTCDataBean.Response._404
        | GetUsableBillingAddressListTCDataBean.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getUsableBillingAddressListTCDataBean`;

        let result:
            | GetUsableBillingAddressListTCDataBean.Response._200
            | GetUsableBillingAddressListTCDataBean.Response._400
            | GetUsableBillingAddressListTCDataBean.Response._401
            | GetUsableBillingAddressListTCDataBean.Response._403
            | GetUsableBillingAddressListTCDataBean.Response._404
            | GetUsableBillingAddressListTCDataBean.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getUsableBillingAddressListTCDataBean, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getUsableBillingAddressListTCDataBean]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async processApplePayOrder(
        requestContext: RequestContext,
        body: ProcessApplePayOrder.Body,
        queryParams?: ProcessApplePayOrder.Query,
        headers?: ProcessApplePayOrder.Header,
    ): Promise<ProcessApplePayOrder.Response._200 | ProcessApplePayOrder.Response._400 | ProcessApplePayOrder.Response._401 | ProcessApplePayOrder.Response._403 | ProcessApplePayOrder.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.processApplePayOrder`;

        let result:
            | ProcessApplePayOrder.Response._200
            | ProcessApplePayOrder.Response._400
            | ProcessApplePayOrder.Response._401
            | ProcessApplePayOrder.Response._403
            | ProcessApplePayOrder.Response._500 = null;

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.processApplePayOrder, queryParams, headers, {}, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [processApplePayOrder]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async lockCart(
        requestContext: RequestContext,
        cartId: string,
        body: LockCart.Body,
        queryParams?: LockCart.Query,
        headers?: LockCart.Header,
    ): Promise<LockCart.Response._200 | LockCart.Response._400 | LockCart.Response._401 | LockCart.Response._403 | LockCart.Response._500> {
        const methodname: string = `${HCLCommerceCartDatasource.name}.lockCart`;

        let result: LockCart.Response._200 | LockCart.Response._400 | LockCart.Response._401 | LockCart.Response._403 | LockCart.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.cartId]: cartId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.lockCart, queryParams, headers, paramMap, body);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [lockCart]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }

    async getUsableShipChargesByShipMode(
        requestContext: RequestContext,
        orderId: string,
        queryParams?: GetUsableShipChargesByShipMode.Query,
        headers?: GetUsableShipChargesByShipMode.Header,
    ): Promise<
        | GetUsableShipChargesByShipMode.Response._200
        | GetUsableShipChargesByShipMode.Response._400
        | GetUsableShipChargesByShipMode.Response._401
        | GetUsableShipChargesByShipMode.Response._403
        | GetUsableShipChargesByShipMode.Response._404
        | GetUsableShipChargesByShipMode.Response._500
    > {
        const methodname: string = `${HCLCommerceCartDatasource.name}.getUsableShipChargesByShipMode`;

        let result:
            | GetUsableShipChargesByShipMode.Response._200
            | GetUsableShipChargesByShipMode.Response._400
            | GetUsableShipChargesByShipMode.Response._401
            | GetUsableShipChargesByShipMode.Response._403
            | GetUsableShipChargesByShipMode.Response._404
            | GetUsableShipChargesByShipMode.Response._500 = null;

        let paramMap = {
            [HCLCommerceCartDatasourcePathParams.orderId]: orderId,
        };

        try {
            result = await this.execute(requestContext, this.serviceDefinitions.getUsableShipChargesByShipMode, queryParams, headers, paramMap);
        } catch (error) {
            this.logger.info(`${methodname} - Error Executing [getUsableShipChargesByShipMode]: ${error}`, requestContext);
            throw error;
        }

        return result;
    }
}
