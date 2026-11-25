import { CommercetoolsEntity, CommercetoolsLocaleField, CommercetoolsReferenceField, CommercetoolsResultSet } from "@plugin-commercetools/common";

export interface CommercetoolsCountry {
    code: string;
}

export interface CommercetoolsStoreProductSelection {
    productSelection: CommercetoolsReferenceField;
    active: boolean;
}

export interface CommercetoolsStore extends CommercetoolsEntity {
    name: CommercetoolsLocaleField;
    languages: string[];
    countries?: CommercetoolsCountry[];
    distributionChannels: CommercetoolsReferenceField[];
    supplyChannels: CommercetoolsReferenceField[];
    productSelections: CommercetoolsStoreProductSelection[];
}

export interface CommercetoolsStoreResultSet extends CommercetoolsResultSet {
    results: CommercetoolsStore[];
}
