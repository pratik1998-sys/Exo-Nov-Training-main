import { CommercetoolsEntity, CommercetoolsEntityAction, CommercetoolsEntityActionRequest, CommercetoolsEntityCreate, CommercetoolsReferenceField, CommercetoolsReferenceFieldInput } from "@plugin-commercetools/common";
import { CommercetoolsAddress } from "@plugin-commercetools/features/address";

export interface CommercetoolsCustomer extends CommercetoolsEntity {
    lastMessageSequenceNumber?: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    title?: string;
    salutation?: string;
    defaultShippingAddressId?: string;
    defaultBillingAddressId?: string;
    dateOfBirth?: string;
    password?: string;
    addresses?: CommercetoolsAddress[];
    shippingAddressIds?: string[];
    billingAddressIds?: string[];
    isEmailVerified?: boolean;
    customerGroupAssignments?: any;
    stores?: CommercetoolsReferenceField[];
    authenticationMode?: string;
}

export interface CommercetoolsCustomerCreate extends CommercetoolsEntityCreate {
    customerNumber?: string;
    externalId?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    title?: string;
    anonymousCart?: CommercetoolsReferenceFieldInput;
    anonymousId?: string;
    companyName?: string;
    vatId?: string;
    salutation?: string;
    dateOfBirth?: string;
    defaultShippingAddress?: number;
    addresses?: CommercetoolsAddress[];
    shippingAddressIds?: number[];
    billingAddressIds?: number[];
    isEmailVerified?: boolean;
    locale?: string;
    stores?: CommercetoolsReferenceFieldInput[];
    customerGroupAssignments?: { customerGroup?: CommercetoolsReferenceFieldInput }[];
    authenticationMode?: string;
}

export interface CommercetoolsCustomerAddressUpdateAction extends CommercetoolsEntityAction {
    addressId?: string;
    address?: CommercetoolsAddress;
}

export interface CommercetoolsCustomerAddressRequest extends CommercetoolsEntityActionRequest {
    actions: CommercetoolsCustomerAddressUpdateAction[];
}
export interface CommercetoolsCustomerCreateResponse {
    customer: CommercetoolsCustomer;
}

export interface CommercetoolsCustomerUpdateResponse {
    customer: CommercetoolsCustomer;
}