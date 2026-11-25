import { CommercetoolsEntity } from "@plugin-commercetools/common";

export interface CommercetoolsAddress extends CommercetoolsEntity {
    externalId?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    streetName?: string;
    streetNumber?: string;
    postalCode?: string;
    city?: string;
    state?: string;
    country?: string;
    pOBox?: string;
    phone?: string;
    mobile?: string;
    email?: string;
    title?: string;
    salutation?: string;
    additionalStreetInfo?: string;
    region?: string;
    company?: string;
    department?: string;
    building?: string;
    apartment?: string;
    fax?: string;
    additionalAddressInfo?: string;
}
