import { CommercetoolsEntity, CommercetoolsLocaleField, CommercetoolsReferenceField, CommercetoolsResultSet } from "@plugin-commercetools/common";
import { CommercetoolsCustomField } from "@plugin-commercetools/features/quote/schema/commercetools.quote.schema";

export interface CommercetoolsCategoryReference extends CommercetoolsReferenceField {
    obj: CommercetoolsCategory;
}

export interface CommercetoolsCategory extends CommercetoolsEntity {
    custom?: CommercetoolsCustomField;
    name: CommercetoolsLocaleField;
    slug: CommercetoolsLocaleField;
    description: CommercetoolsLocaleField;
    ancestors: CommercetoolsReferenceField[];
    parent?: CommercetoolsReferenceField;
    orderHint: string;
    assets: any[];

    //Non-Commercetools fields, but used during  processing
    children?: CommercetoolsCategory[];
}

export interface CommercetoolsCategoryResultSet extends CommercetoolsResultSet {
    results: CommercetoolsCategory[];
}
