import { GraphqlDatasourceQueries } from "@plugin-datasource-graphql";

export class AdobeCommerceAttributeValueBase {
    code?: string;
}

export class AdobeCommerceAttributeValue extends AdobeCommerceAttributeValueBase {
    value?: string;

    static baseGQL = `
        code
        value
    `;
}

export class AdobeCommerceAttributeSelectedOption {
    label?: string;
    value?: string;
}

export class AdobeCommerceAttributeValueSelectedOptions extends AdobeCommerceAttributeValueBase {
    selected_options?: AdobeCommerceAttributeSelectedOption[];
}

export class AdobeCommerceAttributeInputSelectedOption {
    value?: string;
}

export class AdobeCommerceAttributeValueInput {
    attribute_code?: string;
    selected_options?: AdobeCommerceAttributeInputSelectedOption[];
    value?: string;
}

export class AdobeCommerceAttributeInput {
    attribute_code?: string;
    entity_type?: string;
}

export class AdobeCommerceAttributes {
    attribute_code?: string;
    entity_type?: string;
}

export class AdobeCommerceCustomAttributeOptionMetadataV2 {
    label?: string;
    value?: string;
    is_default?: boolean;

    static baseGQL = `
        label
        value
        is_default
    `;
}

export class AdobeCommerceCustomAttributeOptionMetadata {
    label?: string;
    value?: string;

    static baseGQL = `
        label
        value
    `;
}

export class AdobeCommerceCustomAttributeMetadataV2 {
    code?: string;
    default_value?: string;
    entity_type?: string;
    is_required?: boolean;
    label?: string;
    options?: AdobeCommerceCustomAttributeOptionMetadataV2[];

    static baseGQL = `
        code
        default_value
        entity_type
        is_required
        label
        options {
            ${AdobeCommerceCustomAttributeOptionMetadataV2.baseGQL}
        }
    `;
}

export class AdobeCommerceCustomAttributeMetadata {
    attribute_code?: string;
    attribute_type?: string;
    entity_type?: string;
    attribute_options?: AdobeCommerceCustomAttributeOptionMetadata[];

    static baseGQL = `
        attribute_code
        attribute_type
        entity_type
        attribute_options {
            ${AdobeCommerceCustomAttributeOptionMetadata.baseGQL}
        }
    `;
}

export const AdobeCommerceAttributeQueries: GraphqlDatasourceQueries = {
    getCustomAttributeMetaDataV2: {
        queryId: 'customAttributeMetadataV2',
        query: `query GetCustomAttributeMetadataV2($attributes: [AttributeInput!]!){
            customAttributeMetadataV2(attributes:$attributes){
                items {
                    ${AdobeCommerceCustomAttributeMetadataV2.baseGQL}
                }
            }
        }`,
    },

    getCustomAttributeMetaData: {
        queryId: 'customAttributeMetadata',
        query: `query GetCustomAttributeMetadata($attributes: [AttributeInput!]!){
            customAttributeMetadata(attributes:$attributes){
                items {
                    ${AdobeCommerceCustomAttributeMetadata.baseGQL}
                }
            }
        }`,
    },
};
