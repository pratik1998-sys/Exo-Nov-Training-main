import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";
import { HCLCommercePagination } from "@plugin-hcl-commerce/common";

export class HCLCommerceProductAttachment {
    static baseGQL = `
        attachmentAssetID
        attachmentAssetPath
        attachmentAssetPathRaw
        catentryId
        identifier
        image
        mimeType
        name
        sequence
        shortdesc
        usage
    `;
}

export class HCLCommerceAttributeValue {
    static baseGQL = `
        bindToVariant
        identifier
        image1
        image1path
        sequence
        uniqueID
        unitID
        unitOfMeasure
        value
    `;
}

export class HCLCommerceAttribute {
    static baseGQL = `
        attributeNatural
        comparable
        displayable
        facetable
        identifier
        merchandisable
        name
        searchable
        sequence
        storeDisplay
        swatchable
        uniqueID
        usage
        values {
            ${HCLCommerceAttributeValue.baseGQL}
        }
    `;
}

export class HCLCommercePrice {
    static baseGQL = `
        contractId
        currency
        description
        usage
        value
    `;
}

export class HCLCommerceSeo {
    static baseGQL = `
        href
    `;
}

export class HCLCommerceImage {
    static baseGQL = `
        fullImage
        fullImageRaw
        name
        sequence
        thumbnail
        thumbnailRaw
    `;
}

export class HCLCommerceSKU {
    static baseGQL = `
        attachments {
            ${HCLCommerceProductAttachment.baseGQL}
        }
        attributes {
            ${HCLCommerceAttribute.baseGQL}
        }
        buyable
        catalogEntryTypeCode
        fullImage
        fullImageRaw
        hasSingleSKU
        images {
            ${HCLCommerceImage.baseGQL}
        }
        longDescription
        manufacturer
        name
        parentCatalogEntryID
        partNumber
        price {
            ${HCLCommercePrice.baseGQL}
        }
        resourceId
        sellerID
        seo {
            ${HCLCommerceSeo.baseGQL}
        }
        shortDescription
        storeID
        thumbnail
        thumbnailRaw
        uniqueID
    `;
}

// export class HCLCommerceProductComponent {
//     static baseGQL = `
//         attributes {
//             ${HCLCommerceAttribute.baseGQL}
//         }
//         buyable
//         catalogEntryTypeCode
//         hasSingleSKU
//         manufacturer
//         name
//         numberOfSKUs
//         partNumber
//         price {
//             ${HCLCommercePrice.baseGQL}
//         }
//         quantity
//         resourceId
//         sellerId
//         seo {
//             ${HCLCommerceSeo.baseGQL}
//         }
//         shortDescription
//         skus {
//             ${HCLCommerceSKU.baseGQL}
//         }
//         storeID
//         thumbnail
//         thumbnailRaw
//         uniqueID
//     `;
// }

export class HCLCommerceProductComponent {
    static baseGQL = `
        name
    `;
}

export class HCLCommerceProductMerchandiseAssociation {
    static baseGQL = `
        associationType
        attributes {
            ${HCLCommerceAttribute.baseGQL}
        }
        buyable
        catalogEntryTypeCode
        hasSingleSKU
        manufacturer
        name
        numberOfSKUs
        partNumber
        price {
            ${HCLCommercePrice.baseGQL}
        }
        quantity
        relationshipItemId
        resourceId
        sellerId
        seo {
            ${HCLCommerceSeo.baseGQL}
        }
        shortDescription
        skus {
            ${HCLCommerceSKU.baseGQL}
        }
        storeID
        thumbnail
        thumbnailRaw
        uniqueID
    `;
}

export class HCLCommerceUserData {
    static baseGQL = `
        name
        value
    `;
}

export class HCLCommerceProduct {
    static baseGQL = `
        attachments {
            ${HCLCommerceProductAttachment.baseGQL}
        }
        attributes {
            ${HCLCommerceAttribute.baseGQL}
        }
        components {
            ${HCLCommerceProductComponent.baseGQL}
        }
        buyable
        catalogEntryTypeCode
        disallowRecurringOrder
        fullImage
        fullImageRaw
        hasSingleSKU
        images {
            ${HCLCommerceImage.baseGQL}
        }
        keyword
        longDescription
        manufacturer
        merchandisingAssociations {
            ${HCLCommerceProductMerchandiseAssociation.baseGQL}
        }
        name
        numberOfSKUs
        parentCatalogEntryID
        partNumber
        price {
            ${HCLCommercePrice.baseGQL}
        }
        resourceId
        sKUs {
            ${HCLCommerceSKU.baseGQL}
        }
        sellerId
        seo {
            ${HCLCommerceSeo.baseGQL}
        }
        shortDescription
        singleSKUCatalogEntryID
        storeID
        subscriptionTypeCode
        thumbnail
        thumbnailRaw
        uniqueID
        userData {
            ${HCLCommerceUserData.baseGQL}
        }
    `;
}

export class HCLCommerceGroupingProperty {
    static baseGQL = `
        groupCount
        groupHero
        groupOwner
    `;
}

export class HCLCommerceProductContent {
    static baseGQL = `
        attachments {
            ${HCLCommerceProductAttachment.baseGQL}
        }
        attributes {
            ${HCLCommerceAttribute.baseGQL}
        }
        buyable
        catalogEntryTypeCode
        fullImage
        fullImageRaw
        id
        images {
            ${HCLCommerceImage.baseGQL}
        }
        items {
            ${HCLCommerceSKU.baseGQL}
        }
        longDescription
        manufacturer
        name
        parentCatalogEntryID
        partNumber
        price {
            ${HCLCommercePrice.baseGQL}
        }
        sellerId
        seo {
            ${HCLCommerceSeo.baseGQL}
        }
        shortDescription
        storeID
        thumbnail
        thumbnailRaw
        type
        uniqueID
    `;
}

// export class HCLCommerceCatalogEntryView {
//     static baseGQL = `
//         catalogEntryView {
//             ${HCLCommerceProduct.baseGQL}
//         }
//         disallowRecurringOrder
//         fullImage
//         fullImageRaw
//         hasSingleSKU
//         images {
//             ${HCLCommerceImage.baseGQL}
//         }
//         keyword
//         longDescription
//         manufacturer
//         merchandisingAssociations {
//             ${HCLCommerceProductMerchandiseAssociation.baseGQL}
//         }
//         name
//         numberOfSKUs
//         parentCatalogEntryID
//         partnumber
//         price {
//             ${HCLCommercePrice.baseGQL}
//         }
//         resourceId
//         sKUs {
//             ${HCLCommerceSKU.baseGQL}
//         }
//         sellerId
//         seo {
//             ${HCLCommerceSeo.baseGQL}
//         }
//         shortDescription
//         singleSKUCatalogEntryID
//         storeID
//         subscriptionTypeCode
//         thumbnail
//         thumbnailRaw
//         uniqueID
//         userData {
//             ${HCLCommerceUserData.baseGQL}
//         }
//     `;
// }

export class HCLCommerceCatalogEntryView {
    static baseGQL = `
        catalogEntryView {
            ${HCLCommerceProduct.baseGQL}
        }
    `;
}

export class HCLCommerceBreadcrumb {
    static baseGQL = `
        label
        seo {
            ${HCLCommerceSeo.baseGQL}
        }
        type
        value
    `;
}

export class HCLCommerceFacetEntryExtendedData {
    static baseGQL = `
        image1
        parentIds
        sequence
        uniqueId
        unitID
        unitOfMeasure
    `;
}

export class HCLCommerceFacetExtendedData {
    static baseGQL = `
        allValuesReturned
        allowMultipleValueSelection
        displaySequence
        displayable
        fdesc
        fname
        maxDisplay
        maximumValuesToDisplay
        name
        propertyId
        propertyvalue
        sortorder
        zeroDisplay
    `;
}

export class HCLCommerceFacetEntry {
    static baseGQL = `
        count
        extendedData {
            ${HCLCommerceFacetEntryExtendedData.baseGQL}
        }
        image
        label
        value
    `;
}

export class HCLCommerceFacet {
    static baseGQL = `
        entry {
            ${HCLCommerceFacetEntry.baseGQL}
        }
        extendedData {
            ${HCLCommerceFacetExtendedData.baseGQL}
        }
        name
        value
    `;
}

export class HCLCommerceProductSearch {
    static baseGQL = `
        breadCrumbTrailEntryView {
            ${HCLCommerceBreadcrumb.baseGQL}
        }
        contents {
            ${HCLCommerceProductContent.baseGQL}
        }
        facets {
            ${HCLCommerceFacet.baseGQL}
        }
        total
    `;
}

export const HCLCommerceProductQueries: GraphqlDatasourceQueries = {
    findProductByPartnumber: {
        queryId: 'findProductByPartNumber',
        query: `query findProductByPartNumber($catalogId:String, $langId: String, $storeId:String!, $partNumber:String!, $checkEntitlement:Boolean, $currency:String, $contractId:String, $seller:String){
            findProductByPartNumber(catalogId:$catalogId, langId:$langId, storeId:$storeId, partNumber:$partNumber, checkEntitlement:$checkEntitlement, currency:$currency, contractId:$contractId, seller:$seller){
                ${HCLCommercePagination.baseGQL}
                ${HCLCommerceCatalogEntryView.baseGQL}
            }
        }`,
    },

    findProductsByPartNumbers: {
        queryId: 'findProductByPartNumbers',
        query: `query findProductByPartNumbers($catalogId:String, $langId: String, $storeId:String!, $partNumbers:[String]!, $checkEntitlement:Boolean, $currency:String, $contractId:String, $seller:String, $limit:Int, $offset:Int){
            findProductByPartNumbers(catalogId:$catalogId, langId:$langId, storeId:$storeId, partNumber:$partNumbers, checkEntitlement:$checkEntitlement, currency:$currency, contractId:$contractId, seller:$seller, limit:$limit, offset:$offset){
                ${HCLCommercePagination.baseGQL}
                ${HCLCommerceCatalogEntryView.baseGQL}
            }
        }`,
    },

    findProductById: {
        queryId: 'findProductById',
        query: `query findProductById($catalogId:String, $langId: String, $storeId:String!, $id:String!, $checkEntitlement:Boolean, $currency:String, $contractId:String, $seller:String){
            findProductById(catalogId:$catalogId, langId:$langId, storeId:$storeId, productId:$id, checkEntitlement:$checkEntitlement, currency:$currency, contractId:$contractId, seller:$seller){
                ${HCLCommercePagination.baseGQL}
                ${HCLCommerceCatalogEntryView.baseGQL}
            }
        }`,
    },

    findProductsByIds: {
        queryId: 'findProductsByIds',
        query: `query findProductsByIds($catalogId:String, $langId: String, $storeId:String!, $ids:[String]!, $checkEntitlement:Boolean, $currency:String, $contractId:String, $seller:String, $limit:Int, $offset:Int){
            findProductsByIds(catalogId:$catalogId, langId:$langId, storeId:$storeId, id:$ids, checkEntitlement:$checkEntitlement, currency:$currency, contractId:$contractId, seller:$seller, limit:$limit, offset:$offset){
                ${HCLCommercePagination.baseGQL}
                ${HCLCommerceCatalogEntryView.baseGQL}
            }
        }`,
    },

    findProducts: {
        queryId: 'findProducts',
        query: `query findProducts(
            $catalogId: String, 
            $langId: String, 
            $storeId: String!, 
            $categoryId: String, 
            $searchTerm: String, 
            $ids: [String], 
            $partnumbers: [String], 
            $checkEntitlement: Boolean, 
            $currency: String, 
            $contractId: String, 
            $seller: String, 
            $limit: Int, 
            $offset: Int
        ){
            findProducts(
                catalogId: $catalogId, 
                langId: $langId, 
                storeId: $storeId, 
                categoryId: $categoryId, 
                searchTerm: $searchTerm, 
                id: $ids, 
                partNumber: $partnumbers, 
                checkEntitlement: $checkEntitlement, 
                currency: $currency, 
                contractId: $contractId, 
                seller: $seller, 
                limit: $limit, 
                offset: $offset
            ){
                ${HCLCommerceProductSearch.baseGQL}
            }
        }`,
    },
};
