import { RequestParameterDefinition } from "@api-parameters";
import { CommerceRequestParameters, CommerceRequestParametersType } from "@feature-commerce/common";

export interface ProductRequestParametersType extends CommerceRequestParametersType {
    /** GraphQL arg name is `identifier` (product attribute key / `ProductAttribute.identifier`). */
    attributeKey: RequestParameterDefinition;
}

export const ProductRequestParameters: ProductRequestParametersType = {
    ...CommerceRequestParameters,
    attributeKey: {
        id: "identifier",
        description: "Product attribute key (matches `attributes` map key or `ProductAttribute.identifier`)",
    },
};
