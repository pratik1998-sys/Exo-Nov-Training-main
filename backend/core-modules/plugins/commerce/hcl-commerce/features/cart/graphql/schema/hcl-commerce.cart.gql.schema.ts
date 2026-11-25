import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";

export class HCLCommerceOrderExtendedAttributeInput {
    attributeName: string;
    attributeValue: string;
    attributeType?: string;
}

export class HCLCommerceOrderItemAttributeInput {
    attrName: string;
    attrValue: string;
}

export class HCLCommerceOrderItemBaseInput {
    comment?: string;
    contractId?: string;
    fulfillmentCenterId?: string;
    fulfillmentCenterName?: string;
    itemAttributes?: HCLCommerceOrderItemAttributeInput[];
    orderItemExtendAttribute?: HCLCommerceOrderExtendedAttributeInput[];
    quantity?: string;
    shipModeId?: string;
    uOM?: string;
}

export class HCLCommerceOrderItemAddInput extends HCLCommerceOrderItemBaseInput {
    partNumber?: string;
    productId?: string;
    quantity: string;
}

export class HCLCommerceOrderItemUpdateInput extends HCLCommerceOrderItemBaseInput {
    orderItemId: string;
}

export class HCLCommerceCartBaseBodyInput {
    orderId?: string;
    orderExtendAttribute?: HCLCommerceOrderExtendedAttributeInput[];
    xCalculateOrder?: string;
    xCalculationUsage?: string;
    xInventoryValidation?: string;
}

export class HCLCommerceCartItemAddBodyInput extends HCLCommerceCartBaseBodyInput {
    orderItem: HCLCommerceOrderItemAddInput[];
}

export class HCLCommerceCartItemUpdateBodyInput extends HCLCommerceCartBaseBodyInput {
    orderItem: HCLCommerceOrderItemUpdateInput[];
    xValidateInventoryForFulfillmentCenter?: string;
}

export class HCLCommerceFinancialTransactionIdentifierInput {
    externalIdentifier?: string;
    uniqueID?: string;
}

export class HCLCommercePaymentProtocolDataInput {
    name: string;
    value?: string;
}

export class HCLCommerceMoneyInput {
    currency?: string;
    value?: string;
}

export class HCLCommerceUserDataFieldInput {
    key: string;
    value?: string;
}

export class HCLCommerceUserDataInput {
    userDataField: HCLCommerceUserDataFieldInput[];
}

export class HCLCommerceTransactionExtensionDataInput {
    name: string;
    value?: string;
}

export class HCLCommerceFinancialTransactionInput {
    avsCode?: string;
    expirationType?: string;
    lastUpdate?: string;
    merchantOrderNumber?: string;
    paymentInstructionID?: string;
    reasonCode?: string;
    referenceNumber?: string;
    requestTime?: string;
    responseCode?: string;
    status?: string;
    trackingID?: string;
    transactionType?: string;
    financialTransactionIdentifier?: HCLCommerceFinancialTransactionIdentifierInput;
    paymentProtocolData?: HCLCommercePaymentProtocolDataInput;
    requestAmount?: HCLCommerceMoneyInput;
    transactionExtensionData?: HCLCommerceTransactionExtensionDataInput[];
    userData: HCLCommerceUserDataInput;
}

export class HCLCommercePaymentInstructionAttributeInput {
    attrKey: string;
    attrValue?: string;
}

export class HCLCommerceOrganizationIdentifierInput {
    distinguishedName: string;
    uniqueID: string;
}

export class HCLCommercePersonExternalIdentifierInput {
    identifier?: string;
}

export class HCLCommercePersonIdentifierInput {
    distinguishedName: string;
    uniqueID: string;
    externalIdentifier?: HCLCommercePersonExternalIdentifierInput;
}

export class HCLCommercePaymentInstructionProtocolDataInput {
    name: string;
    value?: string;
}

export class HCLCommercePaymentInstructionInput {
    addressLine?: string[];
    addressType?: string;
    attributes?: HCLCommercePaymentInstructionAttributeInput[];
    bestCallingTime?: string;
    billingAddressId?: string;
    businessTitle?: string;
    city?: string;
    country?: string;
    email1: string;
    email2: string;
    fax1: string;
    fax2: string;
    firstName?: string;
    geographicalShippingCode?: string;
    geographicalTaxCode?: string;
    internalOfficeAddress?: string;
    language?: string;
    lastName?: string;
    maxAmount?: HCLCommerceMoneyInput;
    middleName?: string;
    minAmount?: HCLCommerceMoneyInput;
    mobilePhone1?: string;
    mobilePhone1Country?: string;
    nickname: string;
    organizationIdentifier?: HCLCommerceOrganizationIdentifierInput;
    organizationName?: string;
    organizationUnitName?: string;
    payMethodId?: string;
    paymentRule: string;
    paymentTermConditionId: string;
    personIdentifier?: HCLCommercePersonIdentifierInput;
    personTitle?: string;
    phone1: string;
    phone1Publish?: string;
    phone1Type?: string;
    phone2: string;
    phone2Publish?: string;
    phone2Type?: string;
    piAmount?: string;
    piCurrency?: string;
    piDescription?: string;
    piId?: string;
    piLanguage?: string;
    piStatus?: string;
    postalCode?: string;
    primary?: string;
    priority?: string;
    protocolData?: HCLCommercePaymentInstructionProtocolDataInput[];
    refundAllowed?: string;
    sequenceNumber?: string;
    state?: string;
    stateOrProvinceName?: string;
    userDataField?: HCLCommerceUserDataFieldInput[];
    xpaymPolicyId?: string;
    xpaymPunchoutPayment?: string;
    xpaymTokenization?: string;
    zipCode?: string;
}

export class HCLCommercePaymentInstructionBaseBodyInput {
    financialTransaction?: HCLCommerceFinancialTransactionInput[];
    orderId?: string;
    paymentInstruction: HCLCommercePaymentInstructionInput[];
    paymentStatus?: string;
    resourceId: string;
    resourceName?: string;
    userDataField: HCLCommerceUserDataFieldInput[];
    xIsPersonalAddressesAllowedForShipping?: string;
    xIsPurchaseOrderNumberRequired?: string;
    xTrackingIds?: string;
}

export class HCLCommercePaymentInstructionAddBodyInput extends HCLCommercePaymentInstructionBaseBodyInput { }

export class HCLCommerceOrderItemShippingInfoInput {
    addressId?: string;
    orderItemId: string;
    physicalStoreId?: string;
    shipInstructions?: string;
    shipModeId?: string;
}

export class HCLCommerceShippingInfoInput {
    addressId?: string;
    shipAsComplete: string;
    shipModeId: string;
    xCalculationUsage: string;
    orderItem: HCLCommerceOrderItemShippingInfoInput[];
}

export class HCLCommerceAddPromoCodeBodyInput {
    promoCode: string;
}

export class HCLCommerceOrderAdjustment {
    static baseGQL = `
        amount
        code
        currency
        description
        descriptionLanguage
        displayLevel
        language
        usage
        userDataField {
            key
            value
        }
    `;
}

export class HCLCommerceAddress {
    static baseGQL = `
        addressLine
        addressType
        attributes {
            attrKey
            attrValue
        }
        city
        country
        email1
        firstName
        lastName
        middleName
        mobilePhone1
        nickName
        phone1
        postalCode
        primary
        state
        zipCode
    `;
}

export class HCLCommerceCart {
    static baseGQL = `
        couponCode{
            code
            couponId
            description{
                language
                longDescription
                shortDescription
                userData {
                    userDataField {
                        key
                        value
                    }
                }
            }
            effectiveDateTime
            expirationDateTime
            status
            userDataField{
                key
                value
            }
        }
        grandTotal
        grandTotalCurrency
        lastUpdateDate
        locked
        orderAmount{
            adjustment {
                ${HCLCommerceOrderAdjustment.baseGQL}
            }
            grandTotal
            grandTotalCurrency
            totalAdjustment
            totalAdjustmentCurrency
            totalProductPrice
            totalProductPriceCurrency
            totalSalesTax
            totalSalesTaxCurrency
            totalShippingCharge
            totalShippingChargeCurrency
            totalShippingTax
            totalShippingTaxCurrency
            totalTaxByTaxCategory {
                currency
                taxCategoryCode
                value
            }
            userDataField{
                key
                value
            }
        }
        orderDescription
        orderExtendAttribute {
            attributeName
            attributeType
            attributeValue
        }
        orderId
        orderIdentifier{
            customerOrderNumber
            externalOrderID
            orderId
        }
        orderItem{
            availableDate
            comments
            contractId
            correlationGroup
            createDate
            expectedShipDate
            externalOrderItemID
            fulfillmentCenterId
            fulfillmentCenterName
            itemAttributes{
                attrName
                attrValue
            }
            lastUpdateDate
            offerID
            orderItemAmount {
                adjustment {
                    ${HCLCommerceOrderAdjustment.baseGQL}
                }
                currency
                freeGift
                orderItemPrice
                priceOverride
                salesTax
                salesTaxCurrency
                shippingCharge
                shippingChargeCurrency
                shippingTax
                shippingTaxCurrency
                taxByTaxCategory {
                    taxCategoryCode
                }
                totalAdjustment {
                    currency
                    value  
                }
                unitPrice
                unitQuantity
                unitUom
                userDataField {
                    key
                    value
                }
            }
            orderItemComponent{
                catalogEntryIdentifier{
                    externalIdentifier{
                        partNumber
                    }
                    uniqueID
                }
                configurationID
                orderItemComponentIdentifier{
                    uniqueID
                }
                quantity{
                    uom
                    value
                }
                required
                unitPrice {
                    price {
                        currency
                        value
                    }
                    quantity{
                        uom
                        value
                    }
                }
                userData{
                    userDataField {
                        key
                        value
                    }
                }
            }
            orderItemExtendAttribute{
                attributeName
                attributeType
                attributeValue
            }
            orderItemFulfillmentStatus
            orderItemId
            orderItemInventoryStatus
            orderItemShippingInfo{
                isExpedited
                physicalStoreExternalId
                physicalStoreId
                requestedShipDate
                shipCarrAccntNum
                shipInstruction
                shipTieCode
                shippingAddress{
                    addressId
                    ${HCLCommerceAddress.baseGQL}
                }
                shippingCarrierAccountNumber
                shippingChargePolicyID
                shippingChargeType
                shippingMode{
                    carrier
                    description
                    language
                    shipModeCode
                    shipModeDescription
                    shipModeId
                    shipModeLanguage
                    trackingURL
                }
                userDataField{
                    key
                    value
                }
            }
            orderItemStatus
            partNumber
            productId
            quantity
            storeIdentifier {
                externalIdentifier {
                    nameIdentifier
                    ownerID
                }
                uniqueID
            }
            timeReleased
            timeShipped
            uOM
            userDataField{
                key
                value
            }
        }
        orderStatus
        orderVersion
        paymentInstruction{
            billingAddress {
                ${HCLCommerceAddress.baseGQL}
            }
            maxAmount {
                currency
                value
            }
            minAmount {
                currency
                value
            }
            payMethodId
            paymentRule
            paymentTermConditionId
            piAmount
            piCurrency
            piDescription
            piId
            piLanguage
            piStatus
            priority
            protocolData{
                name
                value
            }
            refundAllowed
            sequenceNumber
            userDataField{
                key
                value
            }
        }
        paymentStatus
        placedDate
        promotionCode{
            associatedPromotion{
                description
                promotionId
            }
            code
        }
        quoteID
        quoteIdentifier {
            externalQuoteID
            uniqueID
        }
        recordSetComplete
        recordSetCount
        recordSetTotal
        resourceId
        resourceName
        shipAsComplete
        storeNameIdentifier
        storeUniqueID
        totalAdjustment
        totalAdjustmentCurrency
        totalProductPrice
        totalProductPriceCurrency
        totalSalesTax
        totalSalesTaxCurrency
        totalShippingCharge
        totalShippingChargeCurrency
        totalShippingTax
        totalShippingTaxCurrency
        userDataField{
            key
            value
        }
        xIsPersonalAddressesAllowedForShipping
        xIsPurchaseOrderNumberRequired
        xTrackingIds
    }
    `;
}

export const HCLCommerceCartQueries: GraphqlDatasourceQueries = {
    createCart: {
        queryId: 'cartCreateOrder',
        query: `mutation CreateEmptyCart($storeId: String!, $description: String!) {
            cartCreateOrder(storeId: $storeId, description: $description) {
                outOrderId
            }
        }`,
    },
    addOrderItems: {
        queryId: 'cartAddOrderItem',
        query: `mutation addOrderItems($storeId: String!, $requestBody: orderItemDescInput!) {
            cartAddOrderItem(storeId: $storeId, requestBody: $requestBody) {
                orderId
                orderItem {
                    orderItemId
                }
            }
        }`,
    },
    updateOrderItems: {
        queryId: 'cartUpdateOrderItem',
        query: `mutation updateOrderItems($storeId: String!, $requestBody: updateOrderItemBodyDescriptionInput!) {
            cartUpdateOrderItem(storeId: $storeId, requestBody: $requestBody) {
                orderId
                orderItem {
                    orderItemId
                }
            }
        }`,
    },
    getCart: {
        queryId: 'cartGetCart',
        query: `query GetCart($storeId: String!, $langId:String) {
            cartGetCart(storeId: $storeId, langId:$langId) {
                ${HCLCommerceCart.baseGQL}
        }`,
    },
    setShipping: {
        queryId: '',
        query: `mutation setShipping($storeId:String!, $forUser:String, $forUserId:String, $requestBody: shippingInfoDescInput!){
            shippingInfoUpdateOrderShippingInfo(storeId:$storeId, forUser:$forUser, forUserId:$forUserId, requestBody:$requesBody){
                orderId    
            }
        }`,
    },
    calculateOrder: {
        queryId: 'cartCalculateOrder2',
        query: `mutation calculateOrder($storeId: String!, $orderId: String!) {
            cartCalculateOrder2(storeId: $storeId, orderId: $orderId) {
                orderId
                orderItem {
                    quantity
                }
            }
        }`,
    },
    addPromoCode: {
        queryId: 'postStoreStoreIdCartSelfAssignedPromotionCode',
        query: `mutation addPromoCode($storeId: String!, $requestBody: applyPromotionCodeBodyInput!) {
            postStoreStoreIdCartSelfAssignedPromotionCode(storeId: $storeId, requestBody: $requestBody) {
                orderId
                promoCode
            }
        }`,
    },
    deletePromoCode: {
        queryId: 'deleteStoreStoreIdCartSelfAssignedPromotionCodePromoCode',
        query: `mutation deletePromoCode($storeId: String!, $promoCode: String!) {
            deleteStoreStoreIdCartSelfAssignedPromotionCodePromoCode(storeId: $storeId, promoCode: $promoCode) {
                orderId
            }
        }`,
    },
    addPaymentInstruction: {
        queryId: 'paymentInstructionAddPaymentInstruction',
        query: `mutation addPaymentInstruction($storeId: String!, $requestBody: CartPaymentInstructionInput!) {
            paymentInstructionAddPaymentInstruction(storeId: $storeId, requestBody: $requestBody) {
                orderId
            }
        }`,
    },
    deletePaymentInstruction: {
        queryId: 'paymentInstructionDeletePaymentInstruction',
        query: `mutation deletePaymentInstruction($storeId: String!, $paymentInstructionId: String!) {
            paymentInstructionDeletePaymentInstruction(storeId: $storeId, paymentInstructionId: $paymentInstructionId) {
                orderId
            }
        }`,
    },
    precheckout: {
        queryId: 'cartPreCheckout',
        query: `mutation precheckout($storeId: String!, $orderId: String!) {
            cartPreCheckout(storeId: $storeId, orderId: $orderId) {
                orderId
            }
        }`,
    },
    checkout: {
        queryId: 'cartCheckOut',
        query: `mutation precheckout($storeId: String!, $orderId: String!) {
            cartCheckOut(storeId: $storeId, orderId: $orderId) {
                orderId
            }
        }`,
    },
};
