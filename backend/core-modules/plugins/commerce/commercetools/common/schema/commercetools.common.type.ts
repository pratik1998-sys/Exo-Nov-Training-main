export interface CommercetoolsGetTokenResponse {
    access_token: string;
    expires_in: number;
    scope: string;
    refresh_token: string;
    token_type: string;
}

export interface CommercetoolsUser {
    typeId?: string;
    id?: string;
}

export interface CommercetoolsAudit {
    isPlatformClient?: boolean;
    user?: CommercetoolsUser;
}

export interface CommercetoolsLocaleField {
    [key: string]: string;
}

export interface CommercetoolsLocaleFieldList {
    [key: string]: string[];
}

export interface CommercetoolsReferenceField {
    typeId?: string;
    id?: string;
    obj?: CommercetoolsEntity;
}

export interface CommercetoolsReferenceFieldInput {
    typeId?: string;
    id?: string;
    key?: string;
}

export interface CommercetoolsEntity {
    id?: string;
    version?: number;
    versionModifiedAt?: string;
    lastMessageSequenceNumber?: number;
    createdAt?: string;
    lastModifiedAt?: string;
    lastModifiedBy?: CommercetoolsAudit;
    createdBy?: CommercetoolsAudit;
    key?: string;
}

export interface CommercetoolsEntityCreate {
    key?: string;
}

export interface CommercetoolsResultSet {
    limit?: number;
    offset?: number;
    count?: number;
    total?: number;
    results?: CommercetoolsEntity[];
}

export interface CommercetoolsEntityAction {
    action: string;
    [key: string]: any;
}

export interface CommercetoolsEntityActionRequest {
    version: number;
    actions: CommercetoolsEntityAction[];
}

export interface CommercetoolsMoney {
    type: string;
    currencyCode: string;
    centAmount: number;
    preciseAmount: number;
    fractionDigits: number;
}

export interface CommercetoolsImage {
    url: string;
    label: string;
    dimensions: {
        w: number;
        h: number;
    };
}

export interface CommercetoolsStateReference extends CommercetoolsReferenceField {
    obj: CommercetoolsState;
}

export interface CommercetoolsState extends CommercetoolsEntity {
    type: string;
    name: CommercetoolsLocaleField;
    description: CommercetoolsLocaleField;
    initial: boolean;
    builtIn: boolean;
    roles: string[];
    transitions: CommercetoolsStateReference[];
}

export interface CommercetoolsStateResultSet extends CommercetoolsResultSet {
    results: CommercetoolsState[];
}

export interface CommercetoolsCustomFieldInput {
    type: {
        id?: string;
        key?: string;
    };
    fields: {
        [key: string]: any;
    };
}
