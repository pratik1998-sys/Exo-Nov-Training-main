export namespace getAllPersonContact {
    export type Body = operations['getAllPersonContact']['requestBody']['content']['application/json'];
    export type Query = operations['getAllPersonContact']['parameters']['query'];
    export type Header = operations['getAllPersonContact']['parameters']['header'];
    export namespace Response {
        export type _200 = operations['getAllPersonContact']['responses']['200']['content']['application/json'];
        export type _400 = operations['getAllPersonContact']['responses']['400']['content']['application/json'];
        export type _401 = operations['getAllPersonContact']['responses']['401']['content']['application/json'];
        export type _403 = operations['getAllPersonContact']['responses']['403']['content']['application/json'];
        export type _500 = operations['getAllPersonContact']['responses']['500']['content']['application/json'];
    }
}

export namespace addPersonContact {
    export type Body = operations['addPersonContact']['requestBody']['content']['application/json'];
    export type Query = operations['addPersonContact']['parameters']['query'];
    export type Header = operations['addPersonContact']['parameters']['header'];
    export namespace Response {
        export type _200 = operations['addPersonContact']['responses']['200']['content']['application/json'];
        export type _201 = operations['addPersonContact']['responses']['201']['content']['application/json'];
        export type _400 = operations['addPersonContact']['responses']['400']['content']['application/json'];
        export type _401 = operations['addPersonContact']['responses']['401']['content']['application/json'];
        export type _403 = operations['addPersonContact']['responses']['403']['content']['application/json'];
        export type _500 = operations['addPersonContact']['responses']['500']['content']['application/json'];
    }
}

export namespace findPersonContactById {
    export type Body = operations['findPersonContactById']['requestBody']['content']['application/json'];
    export type Query = operations['findPersonContactById']['parameters']['query'];
    export type Header = operations['findPersonContactById']['parameters']['header'];
    export namespace Response {
        export type _200 = operations['findPersonContactById']['responses']['200']['content']['application/json'];
        export type _400 = operations['findPersonContactById']['responses']['400']['content']['application/json'];
        export type _401 = operations['findPersonContactById']['responses']['401']['content']['application/json'];
        export type _403 = operations['findPersonContactById']['responses']['403']['content']['application/json'];
        export type _404 = operations['findPersonContactById']['responses']['404']['content']['application/json'];
        export type _500 = operations['findPersonContactById']['responses']['500']['content']['application/json'];
    }
}

export namespace findPersonContactByNickName {
    export type Body = operations['findPersonContactByNickName']['requestBody']['content']['application/json'];
    export type Query = operations['findPersonContactByNickName']['parameters']['query'];
    export type Header = operations['findPersonContactByNickName']['parameters']['header'];
    export namespace Response {
        export type _200 = operations['findPersonContactByNickName']['responses']['200']['content']['application/json'];
        export type _400 = operations['findPersonContactByNickName']['responses']['400']['content']['application/json'];
        export type _401 = operations['findPersonContactByNickName']['responses']['401']['content']['application/json'];
        export type _403 = operations['findPersonContactByNickName']['responses']['403']['content']['application/json'];
        export type _404 = operations['findPersonContactByNickName']['responses']['404']['content']['application/json'];
        export type _500 = operations['findPersonContactByNickName']['responses']['500']['content']['application/json'];
    }
}

export namespace updatePersonContact {
    export type Body = operations['updatePersonContact']['requestBody']['content']['application/json'];
    export type Query = operations['updatePersonContact']['parameters']['query'];
    export type Header = operations['updatePersonContact']['parameters']['header'];
    export namespace Response {
        export type _200 = operations['updatePersonContact']['responses']['200']['content']['application/json'];
        export type _400 = operations['updatePersonContact']['responses']['400']['content']['application/json'];
        export type _401 = operations['updatePersonContact']['responses']['401']['content']['application/json'];
        export type _403 = operations['updatePersonContact']['responses']['403']['content']['application/json'];
        export type _404 = operations['updatePersonContact']['responses']['404']['content']['application/json'];
        export type _500 = operations['updatePersonContact']['responses']['500']['content']['application/json'];
    }
}

export namespace deletePersonContact {
    export type Body = operations['deletePersonContact']['requestBody']['content']['application/json'];
    export type Query = operations['deletePersonContact']['parameters']['query'];
    export type Header = operations['deletePersonContact']['parameters']['header'];
    export namespace Response {
        export type _200 = operations['deletePersonContact']['responses']['200']['content']['application/json'];
        export type _400 = operations['deletePersonContact']['responses']['400']['content']['application/json'];
        export type _401 = operations['deletePersonContact']['responses']['401']['content']['application/json'];
        export type _403 = operations['deletePersonContact']['responses']['403']['content']['application/json'];
        export type _404 = operations['deletePersonContact']['responses']['404']['content']['application/json'];
        export type _500 = operations['deletePersonContact']['responses']['500']['content']['application/json'];
    }
}

export interface paths {
    '/store/{storeId}/person/@self/contact': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contact from address book
         * @description Gets the contacts in a person's address book. If the addressType optional query parameter is passed in, the returned contacts are filtered by addressType.
         */
        get: operations['getAllPersonContact'];
        put?: never;
        /**
         * Create contact in address book
         * @description Creates a new contact in a person's address book.
         */
        post: operations['addPersonContact'];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/store/{storeId}/person/@self/contact/byAddressId/{addressId}': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contact by address ID
         * @description Gets a person contact by address ID.
         */
        get: operations['findPersonContactById'];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    '/store/{storeId}/person/@self/contact/{nickName}': {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get contact by nickname
         * @description Gets a person contact by nickname.
         */
        get: operations['findPersonContactByNickName'];
        /**
         * Update contact by nickname
         * @description Updates the contact in the address book identified by nickname.
         */
        put: operations['updatePersonContact'];
        post?: never;
        /**
         * Delete contact from address book
         * @description Deletes the contact in the address book identified by nickname.
         */
        delete: operations['deletePersonContact'];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}

export type webhooks = Record<string, never>;

export interface components {
    schemas: {
        'com.ibm.commerce.user.beans.OrgEntityDataBean_IBM_Parent_Assigned_Roles_Details.parentRolesWithDetails': {
            roleId?: string;
            displayName?: string;
            description?: string;
            name?: string;
        };
        'Oraganization.AdministratorToFindOrganizationInformationByOrganizationIdentifier': {
            country?: string;
            lastName?: string;
            zipCode?: string;
            address3?: string;
            mobilePhone1?: string;
            organizationName?: string;
            address2?: string;
            city?: string;
            address1?: string;
            addressType?: string;
            nickName?: string;
            phone2?: string;
            addressId?: string;
            phone1?: string;
            email2?: string;
            firstName?: string;
            email1?: string;
            middleName?: string;
            state?: string;
            stateProvDisplayName?: string;
            countryDisplayName?: string;
        };
        'Oraganization.AdministratorAddressBook': {
            country?: string;
            lastName?: string;
            zipCode?: string;
            address3?: string;
            mobilePhone1?: string;
            organizationName?: string;
            address2?: string;
            city?: string;
            address1?: string;
            addressType?: string;
            nickName?: string;
            phone2?: string;
            addressId?: string;
            phone1?: string;
            email2?: string;
            firstName?: string;
            email1?: string;
            middleName?: string;
            state?: string;
            stateProvDisplayName?: string;
            countryDisplayName?: string;
        };
        'com.ibm.commerce.user.beans.UserSearchDataBean.userRoles': {
            /** @description The string represented unique numeric ID for identifying the role. */
            roleId?: string;
            /** @description The organization ID that the role belonging to. */
            orgId?: string;
        };
        /** @description Request of OrgEntityUpdateCmd. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler.OrgEntityUpdateRequest': {
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address1?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address2?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address3?: string;
            /** @description Customizable field. */
            addressField1?: string;
            /** @description Customizable field. */
            addressField2?: string;
            /** @description Customizable field. */
            addressField3?: string;
            /** @description Type of address, valid values are configurable by using a properties file: S (shipto), B (billto), and SB (both shipto and billto). A single address may be of different types. If a properties file cannot be found, a default of SB is used. */
            addressType?: string;
            /** @description The first name of the administrator. */
            administratorFirstName?: string;
            /** @description The last name of the administrator. */
            administratorLastName?: string;
            /** @description The middle name of the administrator. */
            administratorMiddleName?: string;
            /** @description You can manage custom member attributes (MBRATTRVAL table) for this user using the following syntax: {attributeName}_{storeId}_{action}_{sequence}: string. The curly braced values must be replaced as follows: attributeName is any attribute specified in MBRATTRVAL table, storeId is the numerical id of the store (or null to indicate all stores), action is either 'r' (for replace) or 'd' (for delete), and sequence to indicate the sequence of this value in relation to other values for this attribute. Some examples. 'JobFunction_10001_r_1' : 'ProductManager' is specifying that the user has a JobFunction attribute value of ProductManager for the store 10001, this is for replacing the first (r_1) JobFunction attribute value for the user. JobFunction_null_d deletes all job functions for the user in all stores.  */
            attributeName_storeId_action_sequence?: string;
            /** @description D - An indicator that daytime is the best time to call the registrant; E - An indicator that evening is the best time to call the registrant. */
            bestCallingTime?: string;
            /** @description The registrant's organization's code to identify the shipping or billing addresses and cost center. */
            billingCode?: string;
            /** @description Code designating the method of code structure used for the billing code. The default value is D, assigned by buyer. */
            billingCodeType?: string;
            /** @description Describes the kind of business performed by an organization or organizational unit. */
            businessCategory?: string;
            /** @description The name of the city where the registrant resides. */
            city?: string;
            /** @description The name of the country or region where the registrant resides. */
            country?: string;
            /** @description A description of the registrant. */
            description?: string;
            /** @description The registrant's primary e-mail or Web address. */
            email1?: string;
            /** @description The registrant's secondary e-mail or Web address. */
            email2?: string;
            /** @description The registrant's primary facsimile number. */
            fax1?: string;
            /** @description The registrant's secondary facsimile number. */
            fax2?: string;
            /** @description The first name of the registrant. */
            firstName?: string;
            /** @description Required if the authentication mode is LDAP: The last name of the registrant. If the authentication mode is LDAP, this parameter is mandatory. */
            lastName?: string;
            /** @description Registered organization identifier; may be null for an organizational unit. */
            legalId?: string;
            /** @description The middle name of the registrant. */
            middleName?: string;
            /** @description The name of the organization that the registrant represents. */
            organizationName?: string;
            /** @description The name of the unit within the organization that the registrant represents. */
            organizationUnitName?: string;
            /** @description Customizable field. */
            orgEntityField1?: string;
            /** @description Customizable field. */
            orgEntityField2?: string;
            /** @description Customizable field. */
            orgEntityField3?: string;
            /** @description The ID for this organization or organizational unit. */
            orgEntityId: string;
            /** @description The name of the organization or organizational unit. */
            orgEntityName?: string;
            /** @description 1 - An indicator to include package inserts when the order is shipped; 0 - An indicator to not include package inserts when the order is shipped. There is no default for this field. If the field is left unused, it remains null in the database. */
            packageSuppression?: string;
            /** @description The title of the user whose address is being entered (for example, Dr., Rev., Mr. or Ms.). */
            personTitle?: string;
            /** @description The registrant's primary phone number. */
            phone1?: string;
            /** @description The type of phone used for the registrant's primary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone1Type?: string;
            /** @description The registrant's secondary phone number. */
            phone2?: string;
            /** @description The type of phone used for the registrant's secondary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone2Type?: string;
            /** @description The registrant's preferred mode of delivery. */
            preferredDelivery?: string;
            /** @description 1 - An indicator that the registrant's primary phone number is listed; 0 - An indicator that the registrant's primary phone number is unlisted. There is no default for these publishPhone fields. If the field is left unused, it remains null in the database. */
            publishPhone1?: string;
            /** @description 1 - An indicator that the registrant's secondary phone number is listed; 0 - An indicator that the registrant's secondary phone number is unlisted. */
            publishPhone2?: string;
            /** @description A shipping code based on geographical region, especially useful with tax software. */
            shippingGeoCode?: string;
            /** @description The name of the state, province, or equivalent where the registrant resides. */
            state?: string;
            /** @description A tax code based on geographical region, especially useful with tax software. */
            taxGeoCode?: string;
            /** @description A string used to identify the user for taxation purposes. */
            taxPayerId?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description The ZIP or postal code of the registrant's address. */
            zipCode?: string;
        };
        'com.ibm.commerce.member.facade.server.commands.UserRegistrationEmailActivateResendCmd': Record<string, never>;
        /** @description Response of registering an organization entity and a buyer. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler.OrgEntityBuyerIdentifier': {
            /** @description The organization entity identifier. */
            orgEntityId: string;
            /** @description The buyer identifier. */
            userId: string;
            viewTaskName?: string;
            /** @description Indicates the status of registration approval. */
            registrationApprovalStatus?: string;
        };
        /** @description Description of approval status record update response. */
        'com.ibm.commerce.rest.approvalstatus.handler.ApprovalStatusHandler.UpdateApprovalStatusResponse': {
            redirecturl?: string;
            resultmsg?: string;
            /** @description Update approval status message. Possible values include 'approvalsFailed' for a failed approval and 'approvalsOK' for a successful approval. */
            viewTaskName?: string;
        };
        'com.ibm.commerce.foundation.common.datatypes.PersonIdentifierType': {
            distinguishedName?: string;
            uniqueID?: string;
            externalIdentifier?: components['schemas']['com.ibm.commerce.foundation.common.datatypes.PersonIdentifierType.externalIdentifier'];
        };
        'person-person.receiveEmailPreference': {
            storeID?: string;
            value: string;
        };
        'person-person.receiveSMSPreference': {
            storeID?: string;
            value: string;
        };
        'person-person.userDataField': {
            key: string;
            value?: string;
        };
        'person-person.contextAttribute.attributeValue': {
            storeId?: string;
            value: string[];
        };
        /** @description Request of ResetPasswordAdministratorCmd. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.ResetPasswordAdministratorRequest': {
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description The administrator password. */
            administratorPassword?: string;
            /** @description The logonId of shopper to reset the password for. */
            logonId: string;
        };
        'com.ibm.commerce.emarketing.beans.EmailUserReceiveDataBean_IBM_optOut_all': {
            userReceiveSMS?: boolean;
            userReceive?: boolean;
        };
        /** @description User identifier. */
        'Person.AdministratorToPerfromActionOnUser': {
            /** @description The user identifier. */
            userId: string;
            viewTaskName?: string;
            addressId?: string;
        };
        'Person.AdministratorToPerfromActionOnUserDelete': {
            response?: {
                message?: string;
                status?: string;
            };
        };
        'java.util.Map.Entry': {
            value?: string;
            key: string;
        };
        /** @description The request body for assigning and/or un-assigning roles. The roleId property takes the forms like roleId, roleId1, roleId2..., the corresponding orgEntityId should be orgEntityId, orgEntiyId1, orgEntityId2... */
        'com.ibm.commerce.rest.member.handler.PersonHandler.MemberRoleAssignmentRequest': {
            /** @description The organization entity identifier. */
            orgEntityId1: string;
            /** @description The role identifier. */
            roleId1: string;
        } & {
            [key: string]: unknown;
        };
        /** @description Request of UserRegistrationAdminUpdateCmd. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.UserRegistrationAdminUpdateRequest': {
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address1?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address2?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address3?: string;
            /** @description Customizable field. */
            addressField1?: string;
            /** @description Customizable field. */
            addressField2?: string;
            /** @description Customizable field. */
            addressField3?: string;
            /** @description The purpose of the address. Valid values are: S - shipto, B - billto, SB - shipto and billto ( default). */
            addressType?: string;
            /** @description The registrant's age. */
            age?: string;
            /** @description A special ID assigned by the registrant's business organization or organizational unit to this particular registrant. */
            alternateId?: string;
            /** @description You can manage custom member attributes (MBRATTRVAL table) for this user using the following syntax: {attributeName}_{storeId}_{action}_{sequence}: string. The curly braced values must be replaced as follows: attributeName is any attribute specified in MBRATTRVAL table, storeId is the numerical id of the store (or null to indicate all stores), action is either 'r' (for replace) or 'd' (for delete), and sequence to indicate the sequence of this value in relation to other values for this attribute. Some examples. 'JobFunction_10001_r_1' : 'ProductManager' is specifying that the user has a JobFunction attribute value of ProductManager for the store 10001, this is for replacing the first (r_1) JobFunction attribute value for the user. JobFunction_null_d deletes all job functions for the user in all stores.  */
            attributeName_storeId_action_sequence?: string;
            /** @description D - An indicator that daytime is the best time to call the registrant; E - An indicator that evening is the best time to call the registrant. */
            bestCallingTime?: string;
            /** @description The registrant's organization's code to identify the shipping or billing addresses and cost center. */
            billingCode?: string;
            /** @description Code designating the method of code structure used for the billing code. The default value is D, assigned by buyer. */
            billingCodeType?: string;
            /** @description Answer to the challenge question. */
            challengeAnswer?: string;
            /** @description Challenge question for verbal confirmation of the customer's identity. */
            challengeQuestion?: string;
            /** @description The number of children the registrant has. */
            children?: string;
            /** @description The name of the city where the registrant resides. */
            city?: string;
            /** @description The company name of the organization that the registrant represents, obtained when filling in demographic information. */
            companyName?: string;
            /** @description The name of the country or region where the registrant resides. */
            country?: string;
            /** @description Date of birth. The format is yyyy-mm-dd, for example: 1980-01-01. */
            dateOfBirth?: string;
            /** @description The department identifier for the registrant. */
            departmentNumber?: string;
            /** @description A description of the registrant. */
            description?: string;
            /** @description The registrant's primary e-mail or Web address. */
            email1?: string;
            /** @description The registrant's secondary e-mail or Web address. */
            email2?: string;
            /** @description The registrant's ID with his or her employer. */
            employeeId?: string;
            /** @description The registrant's status as an employee (for example, regular, permanent, contractor, or part time). */
            employeeType?: string;
            /** @description The registrant's primary facsimile number. */
            fax1?: string;
            /** @description The registrant's secondary facsimile number. */
            fax2?: string;
            /** @description The first name of the registrant. */
            firstName?: string;
            /** @description The registrant's gender. */
            gender?: string;
            /** @description The registrant's hobbies. */
            hobbies?: string;
            /** @description The number of people in the registrant's household; the default is 1. */
            household?: string;
            /** @description The registrant's annual income. */
            income?: string;
            /** @description The currency in which the registrant's income is paid. */
            incomeCurrency?: string;
            /** @description Required if the authentication mode is LDAP: The last name of the registrant. If the authentication mode is LDAP, this parameter is mandatory. */
            lastName?: string;
            /** @description The registrant's logon ID. If you are using LDAP, changing a user's logonID is not supported because it would require deleting and recreating the user in LDAP. This process would cause all non-WebSphere Commerce user attributes, such as the password, to be lost. If you are not using LDAP, changing the user's logon ID is not recommended, because the promotion subsystem stores the logon ID of the creator of the promotion in the XMLPARAM column of the PX_PROMOTION table. Note: When the UserRegistrationUpdate command is used to change the logonID, the command will automatically update the USERS.DN database column. Do not assume that ADDRESS.NICKNAME will also change. Instead, the following finder should be used to get the single self address of a user: AddressAccessBean.findSelfAddressByMember(Long memberID). */
            logonId?: string;
            /** @description The registrant's password. In database mode, the password is encrypted before it is saved in the database. In LDAP mode, the password is only stored on the LDAP server. */
            logonPassword?: string;
            /** @description Required if the logonPassword is used: The registrant's password, entered a second time. */
            logonPasswordVerify?: string;
            /** @description The name of the registrant's manager. */
            manager?: string;
            /** @description The registrant's marital status. */
            maritalStatus?: string;
            /** @description The middle name of the registrant. */
            middleName?: string;
            /** @description The registrant's mobile phone number used for SMS, for example, 4161235555. */
            mobilePhone1?: string;
            /** @description The country code used for the registrant's mobile phone number, for example, CA for Canada. */
            mobilePhone1Country?: string;
            /** @description The internal address (for example, mail stop). */
            officeAddress?: string;
            /** @description Whether the registrant has previously placed an order. This value is supplied by the registrant. */
            orderBefore?: string;
            /** @description The identifier of the registrant's company. */
            organizationId?: string;
            /** @description The name of the organization that the registrant represents. */
            organizationName?: string;
            /** @description The identifier of the registrant's organizational unit. */
            organizationUnitId?: string;
            /** @description The name of the unit within the organization that the registrant represents. */
            organizationUnitName?: string;
            /** @description 1 - An indicator to include package inserts when the order is shipped; 0 - An indicator to not include package inserts when the order is shipped. There is no default for this field. If the field is left unused, it remains null in the database. */
            packageSuppression?: string;
            /** @description The title of the user whose address is being entered (for example, Dr., Rev., Mr. or Ms.). */
            personTitle?: string;
            /** @description The registrant's primary phone number. */
            phone1?: string;
            /** @description The type of phone used for the registrant's primary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone1Type?: string;
            /** @description The registrant's secondary phone number. */
            phone2?: string;
            /** @description The type of phone used for the registrant's secondary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone2Type?: string;
            /** @description URL or path to a photo of the registrant. */
            photo?: string;
            /** @description The account policy for this user. */
            policyAccountId?: string;
            /** @description The preferred phone for the registrant (stored in the ADDRESS table), for example: P1=phone 1 P2=phone 2. */
            preferredCommunication?: string[];
            /** @description The registrant's preferred currency for transactions. */
            preferredCurrency?: string;
            /** @description The registrant's preferred mode of delivery. */
            preferredDelivery?: string;
            /** @description The registrant's preferred language. */
            preferredLanguage?: string;
            /** @description The registrant's preferred unit of measure. */
            preferredMeasure?: string;
            /** @description 1 - An indicator that the registrant's primary phone number is listed; 0 - An indicator that the registrant's primary phone number is unlisted. There is no default for these publishPhone fields. If the field is left unused, it remains null in the database. */
            publishPhone1?: string;
            /** @description 1 - An indicator that the registrant's secondary phone number is listed; 0 - An indicator that the registrant's secondary phone number is unlisted. */
            publishPhone2?: string;
            /** @description Determines whether the registrant wants to receive marketing e-mail activities for the current store (or all stores if no stores have been visited during the session): true - The user wants to receive marketing e-mail activities; false - The user does not want to receive e-mail activities (the default). */
            receiveEmail?: string;
            /** @description Specifies whether the registrant wants to receive marketing SMS messages for the current store (or all stores if no stores have been visited during the session). Valid values are true or false (default). */
            receiveSMS?: string;
            /** @description Indicates whether the user wants to receive order notification SMS text messages. Valid values are true or false (default). */
            receiveSMSNotification?: string;
            /** @description The name of the registrant's secretary or administrative assistant. */
            secretary?: string;
            /** @description A shipping code based on geographical region, especially useful with tax software. */
            shippingGeoCode?: string;
            /** @description The name of the state, province, or equivalent where the registrant resides. */
            state?: string;
            /** @description A tax code based on geographical region, especially useful with tax software. */
            taxGeoCode?: string;
            /** @description The time zone in which the registrant does business (report as GMT +/- hours). */
            timeZone?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description Customizable field. */
            userField1?: string;
            /** @description Customizable field. */
            userField2?: string;
            /** @description Customizable field. */
            userField3?: string;
            /** @description The user the administrator will update. */
            userId?: string;
            /** @description Customizable field. */
            userProfileField1?: string;
            /** @description Customizable field. */
            userProfileField2?: string;
            /** @description The user account status. A status of 1 indicates the account is enabled, and a status of 0 indicates the account is disabled. */
            userStatus?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField1?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField2?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField3?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField4?: string;
            /** @description Customizable field for demographic information; a field of 254 characters. */
            x_demographicField5?: string;
            /** @description Customizable field for demographic information; an integer field. */
            x_demographicField6?: string;
            /** @description Customizable field for demographic information; a field var char, length 6. */
            x_demographicField7?: string;
            /** @description A string used to identify the user for taxation purposes. */
            x_taxPayerId?: string;
            /** @description The ZIP or postal code of the registrant's address. */
            zipCode?: string;
        };
        'person-checkoutProfile': {
            resourceId?: string;
            CheckoutProfile?: {
                shipping_email1?: string;
                shipping_addressLine?: string[];
                shipping_addressId?: string;
                shipping_state?: string;
                shipping_modeId?: string;
                billing_lastName?: string;
                shipping_city?: string;
                shipping_addressType?: string;
                shipping_lastName?: string;
                shipping_zipCode?: string;
                billing_addressType?: string;
                billing_addressLine?: string[];
                billing_state?: string;
                shipping_nickName?: string;
                xchkout_ProfileName?: string;
                billing_primary?: string;
                billing_addressId?: string;
                shipping_firstName?: string;
                billing_country?: string;
                billing_firstName?: string;
                shipping_primary?: string;
                billing_email1?: string;
                billing_city?: string;
                protocolData?: {
                    name?: string;
                    value?: string;
                }[];
                billing_zipCode?: string;
                billing_nickName?: string;
                shipping_country?: string;
            }[];
            resourceName?: string;
            userId?: string;
        };
        'person-checkoutProfile-update': {
            profileName?: string;
            shipping_email1?: string;
            shipping_addressLine?: string[];
            shipping_addressId?: string;
            shipping_state?: string;
            shipping_modeId?: string;
            billing_lastName?: string;
            shipping_city?: string;
            shipping_addressType?: string;
            shipping_lastName?: string;
            shipping_zipCode?: string;
            billing_addressType?: string;
            billing_addressLine?: string[];
            billing_state?: string;
            shipping_nickName?: string;
            billing_primary?: string;
            billing_addressId?: string;
            shipping_firstName?: string;
            billing_country?: string;
            billing_firstName?: string;
            shipping_primary?: string;
            billing_email1?: string;
            billing_city?: string;
            protocolData?: {
                name?: string;
                value?: string;
            }[];
            billing_zipCode?: string;
            billing_nickName?: string;
            shipping_country?: string;
            userId?: string;
        };
        'person-checkoutProfile-updateById': {
            profileName?: string;
            shipping_nickName?: string;
            shipping_firstName?: string;
            shipping_lastName?: string;
            shipping_email1?: string;
            shipping_phone1?: string;
            shipping_addressLine?: string[];
            shipping_city?: string;
            shipping_state?: string;
            shipping_zipCode?: string;
            shipping_country?: string;
            shipping_modeId?: string;
            shipping_addressType?: string;
            billing_nickName?: string;
            billing_firstName?: string;
            billing_lastName?: string;
            billing_email1?: string;
            billing_phone1?: string;
            billing_addressLine?: string[];
            billing_city?: string;
            billing_state?: string;
            billing_zipCode?: string;
            billing_country?: string;
            billing_addressType?: string;
            pay_payment_method?: string;
            pay_cc_brand?: string;
            pay_account?: string;
            pay_expire_month?: string;
            pay_expire_year?: string;
            userId?: string;
        };
        /** @description Empty model. Used as default value when no model is specified. */
        Empty: Record<string, never>;
        /** @description Information about an organization entity identity. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler.UpdateApprovalGroups': {
            /** @description The URL to call when the command completes successfully. */
            URL: string;
            /** @description The organization entity identifier. */
            orgEntityId: string;
            /** @description The ApprovalGroup identifier for a specific organization. */
            segmentId: string;
        };
        'com.ibm.commerce.foundation.common.datatypes.PersonIdentifierType.externalIdentifier': {
            identifier?: string;
        };
        'Person.AdministratorsToFindUserInformationByUserIdentifier': {
            manager?: string;
            mobilePhone1?: string;
            mobilePhone1Country?: string;
            parentMemberId?: string;
            phone2?: string;
            dn?: string;
            employeeId?: string;
            logonPassword?: string;
            parentOrgName?: string;
            userId: string;
            phone1?: string;
            email2?: string;
            email1?: string;
            employeeType?: string;
            secretary?: string;
            logonId: string;
            departmentNumber?: string;
            registrationUpdate?: string;
            fax2?: string;
            registration?: string;
            fax1?: string;
            lastSession?: string;
            logonPasswordVerify?: string;
        };
        'Person.PerformActionByAdministrator': {
            viewTaskName: string;
        };
        /** @description User identifier. */
        'com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier': {
            resourceName?: string;
            addressId?: string;
            /** @description The user identifier. */
            userId?: string;
        };
        'com.ibm.commerce.user.beans.OrgEntityDataBean_IBM_Parent_Assigned_Roles_Details': {
            parentRolesWithDetails?: components['schemas']['com.ibm.commerce.user.beans.OrgEntityDataBean_IBM_Parent_Assigned_Roles_Details.parentRolesWithDetails'][];
            displayName?: string;
            memberId?: string;
            organizationId: string;
            contactInfo?: components['schemas']['Oraganization.AdministratorToFindOrganizationInformationByOrganizationIdentifier'][];
            organizationDisplayName?: string;
            organizationName: string;
            businessCategory?: string | null;
            description?: string | null;
            state?: string;
            addressBook?: components['schemas']['Oraganization.AdministratorAddressBook'][];
            status?: number;
        };
        /** @description Body of MemberGroupMemberUpdateCmd. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.UpdateMemberUser': {
            /** @description MemberGroup Identifiers to explicitly add the user too . */
            addAsExplicitInclusionToMemberGroupId?: string[];
            /** @description MemberGroup Identifiers to explicitly exclude the user from. */
            addAsExplicitExclusionToMemberGroupId?: string[];
            /** @description MemberGroup Identifiers to remove the user from. */
            removeFromMemberGroupId?: string[];
        };
        'com.ibm.commerce.security.commands.ResetPasswordAdministratorCmd': Record<string, never>;
        'com.ibm.commerce.approval.beans.OrderApprovalStatusListDataBean_IBM_Store_Summary': {
            /** Format: int32 */
            recordSetCount?: number;
            recordSetCompleteIndicator?: boolean;
            /** Format: int32 */
            recordSetStartNumber?: number;
            resultList?: components['schemas']['com.ibm.commerce.approval.beans.OrderApprovalStatusListDataBean_IBM_Store_Summary.resultList'][];
            /** Format: int32 */
            recordSetTotal?: number;
        };
        'com.ibm.commerce.member.beans.MemberGroupListDataBean_IBM_Store_Summary.resultList': {
            ownerId?: string;
            description?: string | null;
            name?: string;
            properties?: string;
            memberGroupTypeId?: string;
            /** Format: int64 */
            memberGroupId?: number;
        };
        /** @description response of MemberGroupMemberUpdateCmd. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.UpdateMemberUserResponse': {
            /** @description The current store identifier. */
            storeId?: string;
            /** @description MemberGroup Identifiers to explicitly exclude the user from. */
            addAsExplicitExclusionToMemberGroupId?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description MemberGroup Identifiers to explicitly add the user to. */
            addAsExplicitInclusionToMemberGroupId?: string;
            /** @description The user identifier. */
            userId?: string;
            /** @description The catalog identifier. */
            catalogId?: string;
            /** @description The request type for example, ajax. */
            requesttype?: string;
            /** @description MemberGroup Identifiers to remove the user from. */
            removeFromMemberGroupId?: string;
        };
        'person-person.attributes': {
            bProfileAttrKey?: string;
            bProfileAttrValue?: string;
            contactInfoAttrKey?: string;
            contactInfoAttrValue?: string;
            pProfileAttrKey?: string;
            pProfileAttrValue?: string;
        };
        'person-person.contextAttribute': {
            attributeName: string;
            attributeValue: components['schemas']['person-person.contextAttribute.attributeValue'][];
        };
        'com.ibm.commerce.member.facade.datatypes.IncomeAmountType': {
            currency?: string;
            /** Format: int32 */
            value?: number;
        };
        'com.ibm.commerce.foundation.common.datatypes.OrganizationIdentifierType': {
            distinguishedName?: string;
            uniqueID?: string;
        };
        /** @description Request of UserRegistrationAdminAdd. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.UserRegistrationAdminAddRequest': {
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address1?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address2?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address3?: string;
            /** @description The purpose of the address. Valid values are: S - shipto, B - billto, SB - shipto and billto (default). */
            addressType?: string;
            /** @description The registrant's age. */
            age?: string;
            /** @description A special ID assigned by the registrant's business organization or organizational unit to this particular registrant. */
            alternateId?: string;
            attributes?: {
                /** @description Name of the custom field, eg. addressField1, userField2, userProfileField3, etc. */
                attrKey?: string;
                attrValue?: string;
            }[];
            /** @description You can manage custom member attributes (MBRATTRVAL table) for this user using the following syntax: {attributeName}_{storeId}_{action}_{sequence}: string. The curly braced values must be replaced as follows: attributeName is any attribute specified in MBRATTRVAL table, storeId is the numerical id of the store (or null to indicate all stores), action is either 'r' (for replace) or 'd' (for delete), and sequence to indicate the sequence of this value in relation to other values for this attribute. Some examples. 'JobFunction_10001_r_1' : 'ProductManager' is specifying that the user has a JobFunction attribute value of ProductManager for the store 10001, this is for replacing the first (r_1) JobFunction attribute value for the user. JobFunction_null_d deletes all job functions for the user in all stores.  */
            attributeName_storeId_action_sequence?: string;
            /** @description D - An indicator that daytime is the best time to call the registrant; E - An indicator that evening is the best time to call the registrant. */
            bestCallingTime?: string;
            /** @description The registrant's organization's code to identify the shipping or billing addresses and cost center. */
            billingCode?: string;
            /** @description Code designating the method of code structure used for the billing code. The default value is D, assigned by buyer. */
            billingCodeType?: string;
            /** @description Answer to the challenge question. */
            challengeAnswer?: string;
            /** @description Challenge question for verbal confirmation of the customer's identity. */
            challengeQuestion?: string;
            /** @description The number of children the registrant has. */
            children?: string;
            /** @description The name of the city where the registrant resides. */
            city?: string;
            /** @description The company name of the organization that the registrant represents, obtained when filling in demographic information. */
            companyName?: string;
            /** @description The name of the country or region where the registrant resides. */
            country?: string;
            /** @description Date of birth. The format is yyyy-mm-dd, for example: 1980-01-01. */
            dateOfBirth?: string;
            /** @description The department identifier for the registrant. */
            departmentNumber?: string;
            /** @description A description of the registrant. */
            description?: string;
            /** @description The registrant's primary e-mail or Web address. */
            email1?: string;
            /** @description The registrant's secondary e-mail or Web address. */
            email2?: string;
            /** @description The registrant's ID with his or her employer. */
            employeeId?: string;
            /** @description The registrant's status as an employee (for example, regular, permanent, contractor, or part time). */
            employeeType?: string;
            /** @description The registrant's primary facsimile number. */
            fax1?: string;
            /** @description The registrant's secondary facsimile number. */
            fax2?: string;
            /** @description The first name of the registrant. */
            firstName?: string;
            /** @description The registrant's gender. */
            gender?: string;
            /** @description The registrant's hobbies. */
            hobbies?: string;
            /** @description The number of people in the registrant's household; the default is 1. */
            householdSize?: string;
            /** @description The registrant's annual income. */
            income?: string;
            /** @description The currency in which the registrant's income is paid. */
            incomeCurrency?: string;
            /** @description Required if the authentication mode is LDAP: The last name of the registrant. If the authentication mode is LDAP, this parameter is mandatory. */
            lastName?: string;
            /** @description The registrant's logon ID. If you are using LDAP, changing a user's logonID is not supported because it would require deleting and recreating the user in LDAP. This process would cause all non-WebSphere Commerce user attributes, such as the password, to be lost. If you are not using LDAP, changing the user's logon ID is not recommended, because the promotion subsystem stores the logon ID of the creator of the promotion in the XMLPARAM column of the PX_PROMOTION table. Note: When the UserRegistrationUpdate command is used to change the logonID, the command will automatically update the USERS.DN database column. Do not assume that ADDRESS.NICKNAME will also change. Instead, the following finder should be used to get the single self address of a user: AddressAccessBean.findSelfAddressByMember(Long memberID). */
            logonId: string;
            /** @description The registrant's password. In database mode, the password is encrypted before it is saved in the database. In LDAP mode, the password is only stored on the LDAP server. */
            logonPassword: string;
            /** @description Required if the logonPassword is used: The registrant's password, entered a second time. */
            logonPasswordVerify?: string;
            /** @description The name of the registrant's manager. */
            manager?: string;
            /** @description The registrant's marital status. */
            maritalStatus?: string;
            /** @description The marketing tracking consent. 0 means opt-out, 1 means opt-in. */
            marketingTrackingConsent?: string;
            /** @description The middle name of the registrant. */
            middleName?: string;
            /** @description The registrant's mobile phone number used for SMS, for example, 4161235555. */
            mobilePhone1?: string;
            /** @description The country code used for the registrant's mobile phone number, for example, CA for Canada. */
            mobilePhone1Country?: string;
            /** @description The internal address (for example, mail stop). */
            officeAddress?: string;
            /** @description Whether the registrant has previously placed an order. This value is supplied by the registrant. */
            orderBefore?: string;
            /** @description The fully qualified DN of the organization to register under. Required for B2B user registration.  */
            organizationDistinguishedName?: string;
            /** @description The identifier of the registrant's company. */
            organizationId?: string;
            /** @description The name of the organization that the registrant represents. */
            organizationName?: string;
            /** @description The identifier of the registrant's organizational unit. */
            organizationUnitId?: string;
            /** @description The name of the unit within the organization that the registrant represents. */
            organizationUnitName?: string;
            /** @description 1 - An indicator to include package inserts when the order is shipped; 0 - An indicator to not include package inserts when the order is shipped. There is no default for this field. If the field is left unused, it remains null in the database. */
            packageSuppression?: string;
            /** @description The parent member identifier of the user. */
            parentMemberId?: string;
            /** @description The title of the user whose address is being entered (for example, Dr., Rev., Mr. or Ms.). */
            personTitle?: string;
            /** @description The registrant's primary phone number. */
            phone1?: string;
            /** @description The type of phone used for the registrant's primary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone1Type?: string;
            /** @description The registrant's secondary phone number. */
            phone2?: string;
            /** @description The type of phone used for the registrant's secondary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone2Type?: string;
            /** @description URL or path to a photo of the registrant. */
            photo?: string;
            /** @description The account policy for this user. */
            policyAccountId?: string;
            /** @description The preferred phone for the registrant (stored in the ADDRESS table), for example: P1=phone 1 P2=phone 2. */
            preferredCommunication?: string[];
            /** @description The registrant's preferred currency for transactions. */
            preferredCurrency?: string;
            /** @description The registrant's preferred mode of delivery. */
            preferredDelivery?: string;
            /** @description The registrant's preferred language. */
            preferredLanguage?: string;
            /** @description The registrant's preferred unit of measure. */
            preferredMeasure?: string;
            /** @description The version of the privacy notice. For example '1.0'. */
            privacyNoticeVersion?: string;
            /**
             * @description The user's profile type. If profileType is not specified, by default, the profileType is set to 'C' and a consumer user will be created; A business user can be by setting profileType to 'B'.
             * @enum {string}
             */
            profileType?: 'B' | 'C';
            /** @description 1 - An indicator that the registrant's primary phone number is listed; 0 - An indicator that the registrant's primary phone number is unlisted. There is no default for these publishPhone fields. If the field is left unused, it remains null in the database. */
            publishPhone1?: string;
            /** @description 1 - An indicator that the registrant's secondary phone number is listed; 0 - An indicator that the registrant's secondary phone number is unlisted. */
            publishPhone2?: string;
            /** @description Determines whether the registrant wants to receive marketing e-mail activities for the current store (or all stores if no stores have been visited during the session): true - The user wants to receive marketing e-mail activities; false - The user does not want to receive e-mail activities (the default). */
            receiveEmail?: string;
            /** @description Specifies whether the registrant wants to receive marketing SMS messages for the current store (or all stores if no stores have been visited during the session). Valid values are true or false (default). */
            receiveSMS?: string;
            /** @description Indicates whether the user wants to receive order notification SMS text messages. Valid values are true or false (default). */
            receiveSMSNotification?: string;
            /** @description The name of the registrant's secretary or administrative assistant. */
            secretary?: string;
            /** @description A shipping code based on geographical region, especially useful with tax software. */
            shippingGeoCode?: string;
            /** @description The name of the state, province, or equivalent where the registrant resides. */
            state?: string;
            /** @description A tax code based on geographical region, especially useful with tax software. */
            taxGeoCode?: string;
            /** @description The time zone in which the registrant does business (report as GMT +/- hours). */
            timeZone?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description Customizable field. */
            userField1?: string;
            /** @description Customizable field. */
            userField2?: string;
            /** @description Customizable field. */
            userField3?: string;
            /** @description Customizable field. */
            userProfileField1?: string;
            /** @description Customizable field. */
            userProfileField2?: string;
            /** @description The user account status. A status of 1 indicates the account is enabled, and a status of 0 indicates the account is disabled. */
            userStatus?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField1?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField2?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField3?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField4?: string;
            /** @description Customizable field for demographic information; a field of 254 characters. */
            x_demographicField5?: string;
            /** @description Customizable field for demographic information; an integer field. */
            x_demographicField6?: string;
            /** @description Customizable field for demographic information; a field var char, length 6. */
            x_demographicField7?: string;
            /** @description A string used to identify the user for taxation purposes. */
            x_taxPayerId?: string;
            /** @description The ZIP or postal code of the registrant's address. */
            zipCode?: string;
        };
        'person-contact': {
            resourceId: string;
            resourceName: string;
            userId: string;
            addressId?: string;
            contact: components['schemas']['person-singleContact'][];
        };
        /** @description Request of BuyerRegistrationAddCmd. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler.BuyerRegistrationAddRequest': {
            /** @description The name of the new buyer organization to register. */
            org_orgEntityName: string[];
            /** @description The logonId for the buyer organization's initial administrator. */
            usr_logonId: string[];
            /** @description The logonId for the password of buyer organization's initial administrator's. */
            usr_logonPassword: string[];
            /** @description The logonId for the password of buyer organization's initial administrator's entered a second time. */
            usr_logonPasswordVerify: string[];
        };
        /** @description Information about an organization entity identity. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler.UpdateApprovalGroupsResponse': {
            /** @description The organization entity identifier. */
            orgEntityId: string;
            /** @description The ApprovalGroup identifier for a specific organization. */
            segmentId: string;
            /** @description The URL to call when the command completes successfully. */
            URL: string;
            /** @description The current store identifier. */
            storeId?: string;
            /** @description The catalog identifier. */
            catalogId?: string;
            /** @description The request type for example, ajax. */
            requesttype?: string;
        };
        /** @description User identification container. */
        'com.ibm.commerce.rest.member.handler.PersonCheckoutProfileHandler.UserIdContainer': {
            /** @description User identification. */
            userId: string;
            resourceName?: string;
        };
        /** @description Checkout out profile identification container. */
        'com.ibm.commerce.rest.member.handler.PersonCheckoutProfileHandler.CheckoutProfileIdContainer': {
            /** @description Check out profile identification. */
            checkoutProfileId: string;
        };
        'person-person': {
            /** @enum {string} */
            accountStatus?: 'Enabled' | 'Disabled';
            addressId?: string;
            addressLine?: string[];
            addressType?: string;
            attributes?: components['schemas']['person-person.attributes'][];
            bestCallingTime?: string;
            businessTitle?: string;
            challengeQuestion?: string;
            resourceId?: string;
            resourceName?: string;
            checkoutProfileUrl?: string;
            contactUrl?: string;
            city?: string;
            companyName?: string;
            contact?: components['schemas']['person-singleContact'][];
            contextAttribute?: components['schemas']['person-person.contextAttribute'][];
            country?: string;
            dateOfBirth?: string;
            departmentNumber?: string;
            description?: string;
            displayName?: string;
            distinguishedName?: string;
            email1?: string;
            email2?: string;
            employeeID?: string;
            employeeType?: string;
            fax1?: string;
            fax2?: string;
            firstName?: string;
            /** @enum {string} */
            gender?: 'Male' | 'Female' | 'Unspecified';
            geographicalShippingCode?: string;
            geographicalTaxCode?: string;
            hobbies?: string;
            /** Format: int32 */
            householdSize?: string;
            income?: components['schemas']['com.ibm.commerce.member.facade.datatypes.IncomeAmountType'];
            internalOfficeAddress?: string;
            language?: string;
            lastName?: string;
            lastUpdate?: string;
            logonId?: string;
            manager?: string;
            maritalStatus?: string;
            middleName?: string;
            mobilePhone1?: string;
            mobilePhone1Country?: string;
            nickName?: string;
            /** Format: int32 */
            numberOfChildren?: string;
            organizationDistinguishedName?: string;
            organizationIdentifier?: components['schemas']['com.ibm.commerce.foundation.common.datatypes.OrganizationIdentifierType'];
            organizationName?: string;
            organizationUnitName?: string;
            orgizationId?: string;
            passwordExpired?: string;
            personIdentifier?: components['schemas']['com.ibm.commerce.foundation.common.datatypes.PersonIdentifierType'];
            personTitle?: string;
            phone1?: string;
            phone1Publish?: string;
            phone1Type?: string;
            phone2?: string;
            phone2Publish?: string;
            phone2Type?: string;
            photoURI?: string;
            preferredCommunication?: string;
            preferredCurrency?: string;
            preferredDelivery?: string;
            preferredLanguage?: string;
            primary?: string;
            /** @enum {string} */
            profileType?: 'C' | 'B';
            receiveEmailPreference?: components['schemas']['person-person.receiveEmailPreference'][];
            receiveSMSNotification?: string;
            receiveSMSPreference?: components['schemas']['person-person.receiveSMSPreference'][];
            registrationApprovalStatus?: string;
            registrationDateTime?: string;
            /** @enum {string} */
            registrationStatus?: 'Guest' | 'RegisteredPerson';
            /** @description The name of the registrant's secretary or administrative assistant. */
            secretary?: string;
            state?: string;
            userDataField?: components['schemas']['person-person.userDataField'][];
            userId?: string;
            zipCode?: string;
        };
        'person-name': {
            firstName?: string;
            lastName?: string;
            middleName?: string;
        };
        /** @description Request of UserRegistrationUpdateCmd. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.UserRegistrationUpdateRequest': {
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address1?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address2?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address3?: string;
            /** @description The purpose of the address. Valid values are: S - shipto, B - billto, SB - shipto and billto (default). */
            addressType?: string;
            /** @description The registrant's age. */
            age?: string;
            /** @description A special ID assigned by the registrant's business organization or organizational unit to this particular registrant. */
            alternateId?: string;
            attributes?: {
                /** @description Name of the custom field, eg. addressField1, userField2, userProfileField3, etc. */
                attrKey?: string;
                attrValue?: string;
            }[];
            /** @description You can manage custom member attributes (MBRATTRVAL table) for this user using the following syntax: {attributeName}_{storeId}_{action}_{sequence}: string. The curly braced values must be replaced as follows: attributeName is any attribute specified in MBRATTRVAL table, storeId is the numerical id of the store (or null to indicate all stores), action is either 'r' (for replace) or 'd' (for delete), and sequence to indicate the sequence of this value in relation to other values for this attribute. Some examples. 'JobFunction_10001_r_1' : 'ProductManager' is specifying that the user has a JobFunction attribute value of ProductManager for the store 10001, this is for replacing the first (r_1) JobFunction attribute value for the user. JobFunction_null_d deletes all job functions for the user in all stores.  */
            attributeName_storeId_action_sequence?: string;
            /** @description D - An indicator that daytime is the best time to call the registrant; E - An indicator that evening is the best time to call the registrant. */
            bestCallingTime?: string;
            /** @description The registrant's organization's code to identify the shipping or billing addresses and cost center. */
            billingCode?: string;
            /** @description Code designating the method of code structure used for the billing code. The default value is D, assigned by buyer. */
            billingCodeType?: string;
            /** @description Answer to the challenge question. */
            challengeAnswer?: string;
            /** @description Challenge question for verbal confirmation of the customer's identity. */
            challengeQuestion?: string;
            /** @description The number of children the registrant has. */
            children?: string;
            /** @description The name of the city where the registrant resides. */
            city?: string;
            /** @description The company name of the organization that the registrant represents, obtained when filling in demographic information. */
            companyName?: string;
            /** @description The name of the country or region where the registrant resides. */
            country?: string;
            /** @description Date of birth. The format is yyyy-mm-dd, for example: 1980-01-01. */
            dateOfBirth?: string;
            /** @description The department identifier for the registrant. */
            departmentNumber?: string;
            /** @description A description of the registrant. */
            description?: string;
            /** @description The registrant's primary e-mail or Web address. */
            email1?: string;
            /** @description The registrant's secondary e-mail or Web address. */
            email2?: string;
            /** @description The registrant's ID with his or her employer. */
            employeeId?: string;
            /** @description The registrant's status as an employee (for example, regular, permanent, contractor, or part time). */
            employeeType?: string;
            /** @description The registrant's primary facsimile number. */
            fax1?: string;
            /** @description The registrant's secondary facsimile number. */
            fax2?: string;
            /** @description The first name of the registrant. */
            firstName?: string;
            /** @description The registrant's gender. */
            gender?: string;
            /** @description The registrant's hobbies. */
            hobbies?: string;
            /** @description The number of people in the registrant's household; the default is 1. */
            householdSize?: string;
            /** @description The registrant's annual income. */
            income?: string;
            /** @description The currency in which the registrant's income is paid. */
            incomeCurrency?: string;
            /** @description Required if the authentication mode is LDAP: The last name of the registrant. If the authentication mode is LDAP, this parameter is mandatory. */
            lastName?: string;
            /** @description The registrant's logon ID. If you are using LDAP, changing a user's logonID is not supported because it would require deleting and recreating the user in LDAP. This process would cause all non-WebSphere Commerce user attributes, such as the password, to be lost. If you are not using LDAP, changing the user's logon ID is not recommended, because the promotion subsystem stores the logon ID of the creator of the promotion in the XMLPARAM column of the PX_PROMOTION table. Note: When the UserRegistrationUpdate command is used to change the logonID, the command will automatically update the USERS.DN database column. Do not assume that ADDRESS.NICKNAME will also change. Instead, the following finder should be used to get the single self address of a user: AddressAccessBean.findSelfAddressByMember(Long memberID). */
            logonId?: string;
            /** @description The registrant's password. During password reset, this value also acts as the new password. In database mode, the password is encrypted before it is saved in the database. In LDAP mode, the password is only stored on the LDAP server. */
            logonPassword?: string;
            /**
             * @deprecated
             * @description Required if the logonPassword is used: The registrant's password, entered a second time.
             */
            logonPasswordVerify?: string;
            /** @description The name of the registrant's manager. */
            manager?: string;
            /** @description The registrant's marital status. */
            maritalStatus?: string;
            /** @description The marketing tracking consent. 0 means opt-out, 1 means opt-in. */
            marketingTrackingConsent?: string;
            /** @description The middle name of the registrant. */
            middleName?: string;
            /** @description The registrant's mobile phone number used for SMS, for example, 4161235555. */
            mobilePhone1?: string;
            /** @description The country code used for the registrant's mobile phone number, for example, CA for Canada. */
            mobilePhone1Country?: string;
            /** @description The internal address (for example, mail stop). */
            officeAddress?: string;
            /** @description Whether the registrant has previously placed an order. This value is supplied by the registrant. */
            orderBefore?: string;
            /** @description The identifier of the registrant's company. */
            organizationId?: string;
            /** @description The name of the organization that the registrant represents. */
            organizationName?: string;
            /** @description The identifier of the registrant's organizational unit. */
            organizationUnitId?: string;
            /** @description The name of the unit within the organization that the registrant represents. */
            organizationUnitName?: string;
            /** @description 1 - An indicator to include package inserts when the order is shipped; 0 - An indicator to not include package inserts when the order is shipped. There is no default for this field. If the field is left unused, it remains null in the database. */
            packageSuppression?: string;
            /** @description The title of the user whose address is being entered (for example, Dr., Rev., Mr. or Ms.). */
            personTitle?: string;
            /** @description The registrant's primary phone number. */
            phone1?: string;
            /** @description The type of phone used for the registrant's primary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone1Type?: string;
            /** @description The registrant's secondary phone number. */
            phone2?: string;
            /** @description The type of phone used for the registrant's secondary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone2Type?: string;
            /** @description URL or path to a photo of the registrant. */
            photo?: string;
            /** @description The preferred phone for the registrant (stored in the ADDRESS table), for example: P1=phone 1 P2=phone 2. */
            preferredCommunication?: string[];
            /** @description The registrant's preferred currency for transactions. */
            preferredCurrency?: string;
            /** @description The registrant's preferred mode of delivery. */
            preferredDelivery?: string;
            /** @description The registrant's preferred language. */
            preferredLanguage?: string;
            /** @description The registrant's preferred unit of measure. */
            preferredMeasure?: string;
            /** @description The version of the privacy notice. For example '1.0'. */
            privacyNoticeVersion?: string;
            /** @description 1 - An indicator that the registrant's primary phone number is listed; 0 - An indicator that the registrant's primary phone number is unlisted. There is no default for these publishPhone fields. If the field is left unused, it remains null in the database. */
            publishPhone1?: string;
            /** @description 1 - An indicator that the registrant's secondary phone number is listed; 0 - An indicator that the registrant's secondary phone number is unlisted. */
            publishPhone2?: string;
            /** @description Determines whether the registrant wants to receive marketing e-mail activities for the current store (or all stores if no stores have been visited during the session): true - The user wants to receive marketing e-mail activities; false - The user does not want to receive e-mail activities (the default). */
            receiveEmail?: string;
            /** @description Specifies whether the registrant wants to receive marketing SMS messages for the current store (or all stores if no stores have been visited during the session). Valid values are true or false (default). */
            receiveSMS?: string;
            /** @description Indicates whether the user wants to receive order notification SMS text messages. Valid values are true or false (default). */
            receiveSMSNotification?: string;
            /** @description During password reset, this value must be set to 'true'. */
            resetPassword?: string;
            /** @description The name of the registrant's secretary or administrative assistant. */
            secretary?: string;
            /** @description A shipping code based on geographical region, especially useful with tax software. */
            shippingGeoCode?: string;
            /** @description The name of the state, province, or equivalent where the registrant resides. */
            state?: string;
            /** @description A tax code based on geographical region, especially useful with tax software. */
            taxGeoCode?: string;
            /** @description The time zone in which the registrant does business (report as GMT +/- hours). */
            timeZone?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description Customizable field. */
            userField1?: string;
            /** @description Customizable field. */
            userField2?: string;
            /** @description Customizable field. */
            userField3?: string;
            /** @description Customizable field. */
            userProfileField1?: string;
            /** @description Customizable field. */
            userProfileField2?: string;
            /** @description During password reset, the registrant must enter the old password. */
            xcred_logonPasswordOld?: string;
            /** @description During password reset, the registrant must enter the new password a second time. */
            xcred_logonPasswordVerify?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField1?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField2?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField3?: string;
            /** @description Customizable field for demographic information; this is single-character field. */
            x_demographicField4?: string;
            /** @description Customizable field for demographic information; a field of 254 characters. */
            x_demographicField5?: string;
            /** @description Customizable field for demographic information; an integer field. */
            x_demographicField6?: string;
            /** @description Customizable field for demographic information; a field var char, length 6. */
            x_demographicField7?: string;
            /** @description A string used to identify the user for taxation purposes. */
            x_taxPayerId?: string;
            /** @description The ZIP or postal code of the registrant's address. */
            zipCode?: string;
        };
        'person-singleContact': {
            addressType?: string;
            addressLine?: string[];
            addressId?: string;
            personTitle?: string;
            primary?: string;
            email2?: string;
            email1?: string;
            city?: string;
            middleName?: string;
            geographicalTaxCode?: string;
            state?: string;
            internalOfficeAddress?: string;
            fax2?: string;
            fax1?: string;
            organizationIdentifier?: components['schemas']['com.ibm.commerce.foundation.common.datatypes.OrganizationIdentifierType'];
            phone1Type?: string;
            nickName?: string;
            phone2Type?: string;
            phone2?: string;
            businessTitle?: string;
            phone1?: string;
            zipCode?: string;
            bestCallingTime?: string;
            mobilePhone1Country?: string;
            phone2Publish?: string;
            mobilePhone1?: string;
            personIdentifier?: components['schemas']['com.ibm.commerce.foundation.common.datatypes.PersonIdentifierType'];
            organizationUnitName?: string;
            organizationName?: string;
            language?: string;
            firstName?: string;
            lastName?: string;
            resourceId?: string;
            resourceName?: string;
            geographicalShippingCode?: string;
            phone1Publish?: string;
            attributes?: components['schemas']['java.util.Map.Entry'][];
            country?: string;
            userDataField?: components['schemas']['person-singleContact.userDataField'][];
        };
        'person-DeleteContact': {
            resourceName?: string;
            addressId?: string[];
        };
        'com.ibm.commerce.approval.beans.ApprovalStatusDataBean_IBM_Store_Summary': {
            resultList?: {
                approvalStatusId?: string;
                approverGroupId?: string;
                /** Format: date */
                submitTime?: string;
                flowTypeId?: string;
                stateId?: string;
                comment?: string;
                submitterId?: string;
                flowId?: string;
                /** Format: date */
                approveTime?: string;
                status?: string;
                approverId?: string;
                entityId?: string;
            }[];
        };
        'com.ibm.commerce.approval.beans.ApprovalGroupTypeListBean_IBM_Store_Summary.resultList': {
            memberGroupTypeId?: string;
            properties?: string;
            description?: string;
            name?: string;
        };
        'Person.UpdateCurrencyAndLanguagePreferenceCmd': {
            redirecturl?: string;
            viewTaskName?: string;
        };
        'Person.ChangeLanguageAndCurrencyForm': {
            langId?: string;
            currency: string;
            URL: string;
        };
        /** @description Description of the post input body to update an approval status record. */
        'com.ibm.commerce.rest.approvalstatus.handler.ApprovalStatusHandler.UpdateApprovalStatusParameterDescription': {
            /** @description Comment text for status change. */
            comments?: string;
            /**
             * @description Approval status. Valid values are 1 for approve and 2 for reject.
             * @enum {string}
             */
            aprv_act: '1' | '2';
        };
        'com.ibm.commerce.member.beans.OrganizationListDataBean_IBM_Organization_Summary.entitledOrganizations': {
            distinguishedName?: string;
            /** Format: int64 */
            organizationId?: number;
            displayName?: string;
            /** Format: int64 */
            memberId?: number;
            organizationName?: string;
        };
        'com.ibm.commerce.approval.beans.ApprovalGroupTypeListBean_IBM_Store_Summary': {
            resultList?: components['schemas']['com.ibm.commerce.approval.beans.ApprovalGroupTypeListBean_IBM_Store_Summary.resultList'][];
        };
        'com.ibm.commerce.user.beans.MemberRoleAssignDataBean_IBM_Roles_Of_User_In_Orgs_I_Can_Admin.orgIdRoleDataBeans': Record<string, never>;
        'com.ibm.commerce.member.beans.MemberGroupListDataBean_IBM_Store_Summary': {
            /** Format: int32 */
            recordSetCount?: number;
            recordSetCompleteIndicator?: boolean;
            /** Format: int32 */
            recordSetStartNumber?: number;
            resultList?: components['schemas']['com.ibm.commerce.member.beans.MemberGroupListDataBean_IBM_Store_Summary.resultList'][];
            /** Format: int32 */
            recordSetTotal?: number;
        };
        /** @description Delete context attribute response. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.DeleteContextAttribute': {
            /** @description The user identifier list. */
            userId: string[];
            /** @description The address identifier list. */
            addressId: string[];
        };
        /** @description Request of OrgEntityAddCmd. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler.OrgEntityAddRequest': {
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address1?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address2?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address3?: string;
            /** @description Customizable field. */
            addressField1?: string;
            /** @description Customizable field. */
            addressField2?: string;
            /** @description Customizable field. */
            addressField3?: string;
            /** @description Type of address, valid values are configurable by using a properties file: S (shipto), B (billto), and SB (both shipto and billto). A single address may be of different types. If a properties file cannot be found, a default of SB is used. */
            addressType?: string;
            /** @description The first name of the administrator. */
            administratorFirstName?: string;
            /** @description The last name of the administrator. */
            administratorLastName?: string;
            /** @description The middle name of the administrator. */
            administratorMiddleName?: string;
            /** @description You can manage custom member attributes (MBRATTRVAL table) for this user using the following syntax: {attributeName}_{storeId}_{action}_{sequence}: string. The curly braced values must be replaced as follows: attributeName is any attribute specified in MBRATTRVAL table, storeId is the numerical id of the store (or null to indicate all stores), action is either 'r' (for replace) or 'd' (for delete), and sequence to indicate the sequence of this value in relation to other values for this attribute. Some examples. 'JobFunction_10001_r_1' : 'ProductManager' is specifying that the user has a JobFunction attribute value of ProductManager for the store 10001, this is for replacing the first (r_1) JobFunction attribute value for the user. JobFunction_null_d deletes all job functions for the user in all stores.  */
            attributeName_storeId_action_sequence?: string;
            /** @description D - An indicator that daytime is the best time to call the registrant; E - An indicator that evening is the best time to call the registrant. */
            bestCallingTime?: string;
            /** @description The registrant's organization's code to identify the shipping or billing addresses and cost center. */
            billingCode?: string;
            /** @description Code designating the method of code structure used for the billing code. The default value is D, assigned by buyer. */
            billingCodeType?: string;
            /** @description Describes the kind of business performed by an organization or organizational unit. */
            businessCategory?: string;
            /** @description The name of the city where the registrant resides. */
            city?: string;
            /** @description The name of the country or region where the registrant resides. */
            country?: string;
            /** @description A description of the registrant. */
            description?: string;
            /** @description DN of the organization or organizational unit, for LDAP use. */
            distinguishedName: string;
            /** @description The registrant's primary e-mail or Web address. */
            email1?: string;
            /** @description The registrant's secondary e-mail or Web address. */
            email2?: string;
            /** @description The registrant's primary facsimile number. */
            fax1?: string;
            /** @description The registrant's secondary facsimile number. */
            fax2?: string;
            /** @description The first name of the registrant. */
            firstName?: string;
            /** @description Required if the authentication mode is LDAP: The last name of the registrant. If the authentication mode is LDAP, this parameter is mandatory. */
            lastName?: string;
            /** @description Registered organization identifier; may be null for an organizational unit. */
            legalId?: string;
            /** @description The middle name of the registrant. */
            middleName?: string;
            /** @description The name of the organization that the registrant represents. */
            organizationName?: string;
            /** @description The name of the unit within the organization that the registrant represents. */
            organizationUnitName?: string;
            /** @description Customizable field. */
            orgEntityField1?: string;
            /** @description Customizable field. */
            orgEntityField2?: string;
            /** @description Customizable field. */
            orgEntityField3?: string;
            /** @description The name of the organization or organizational unit. Leading and trailing spaces is trimmed. When the system is configured with LDAP, the following characters are not allowed when the orgEntityName is used to construct the distinguished name: 1. The # character occurring at the beginning of orgEntityName. 2. Any of the following characters: = , + " \ < > ;. */
            orgEntityName: string;
            /** @description The type of the organizational entity being added. O - Organization; OU - Organizational Unit. */
            orgEntityType: string;
            /** @description 1 - An indicator to include package inserts when the order is shipped; 0 - An indicator to not include package inserts when the order is shipped. There is no default for this field. If the field is left unused, it remains null in the database. */
            packageSuppression?: string;
            /** @description Required if orgEntityType equals 'OU': The member ID of the parent organizational entity where the new organizational entity is added. For an organization (orgEntityType=O), this parameter is not mandatory; it defaults to Root Organization. */
            parentMemberId: string;
            /** @description The title of the user whose address is being entered (for example, Dr., Rev., Mr. or Ms.). */
            personTitle?: string;
            /** @description The registrant's primary phone number. */
            phone1?: string;
            /** @description The type of phone used for the registrant's primary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone1Type?: string;
            /** @description The registrant's secondary phone number. */
            phone2?: string;
            /** @description The type of phone used for the registrant's secondary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone2Type?: string;
            /** @description The registrant's preferred mode of delivery. */
            preferredDelivery?: string;
            /** @description 1 - An indicator that the registrant's primary phone number is listed; 0 - An indicator that the registrant's primary phone number is unlisted. There is no default for these publishPhone fields. If the field is left unused, it remains null in the database. */
            publishPhone1?: string;
            /** @description 1 - An indicator that the registrant's secondary phone number is listed; 0 - An indicator that the registrant's secondary phone number is unlisted. */
            publishPhone2?: string;
            /** @description A shipping code based on geographical region, especially useful with tax software. */
            shippingGeoCode?: string;
            /** @description The name of the state, province, or equivalent where the registrant resides. */
            state?: string;
            /** @description A tax code based on geographical region, especially useful with tax software. */
            taxGeoCode?: string;
            /** @description A string used to identify the user for taxation purposes. */
            taxPayerId?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description The ZIP or postal code of the registrant's address. */
            zipCode?: string;
        };
        /** @description Response of UserRegistrationAdminAddCmd. */
        'com.ibm.commerce.rest.member.handler.PersonHandler.UserRegistrationAdminAddResponse': {
            /** @description The user unique identifier. */
            userId: string;
            /** @description The logon ID of the user. */
            logonId?: string;
            /** @description The address identifier of the user. */
            addressId: string;
            personalizationID: string;
            resourceName: string;
            WCToken: string;
            WCTrustedToken?: string;
        };
        /** @description Address identifier. */
        'com.ibm.commerce.rest.member.handler.PersonContactHandler.AddressIdentifier': {
            /** @description The address identifier. */
            addressId: string;
        };
        /** @description Information about an organization entity identity. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler.OrgEntityIdentity': {
            /** @description The organization entity identifier. */
            orgEntityId: string;
            /** @description The address identifier of the organization entity. */
            addressId: string;
        };
        'com.ibm.commerce.member.beans.OrganizationListDataBean_IBM_Organization_Summary': {
            entitledOrganizations?: components['schemas']['com.ibm.commerce.member.beans.OrganizationListDataBean_IBM_Organization_Summary.entitledOrganizations'][];
            accountCheck?: boolean;
        };
        'person-singleContact.userDataField': {
            value?: string;
            key: string;
        };
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details': {
            /** Format: int32 */
            recordSetCount?: number;
            /** Format: int32 */
            pageNumber?: number;
            userDataBeans?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans'][] | null;
            pageSize?: string;
            /** Format: int32 */
            recordSetTotal?: number;
            recordSetCompleteIndicator?: boolean;
        };
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans': {
            businessProfile?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.businessProfile'];
            demographics?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.demographics'];
            displayName?: string | null;
            distinguishedName?: string;
            firstName?: string;
            lastName?: string;
            logonId?: string;
            memberAttributeValues?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.memberAttributeValues'][];
            memberId?: string;
            parentMemberId?: string;
            personalizationId?: string | null;
            preferredCurrency?: string | null;
            preferredLanguageId?: string;
            profileType?: string;
            registerType?: string;
            roles?: number[];
            userRoles?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean.userRoles'][];
            state?: string;
            userId?: string;
            userProfile?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.userProfile'];
            userRegistry?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.userRegistry'];
        } | null;
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.userProfile': {
            preferredCommunication?: string | null;
            preferredMeasure?: string | null;
            displayName?: string | null;
            /** @description A string used to identify the user for taxation purposes. */
            taxPayerId?: string;
            description?: string;
            preferredDelivery?: string | null;
            receiveSMSNotification?: string;
        } | null;
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.businessProfile': {
            organizationId?: string;
            employeeType?: string;
            departmentNumber?: string;
            employeeId?: string | null;
            organizationUnitId?: string;
            requistionerId?: string;
        } | null;
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.userRegistry': {
            logonId?: string;
            policyAccountId?: string;
            status?: string;
        };
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.demographics': {
            income?: string;
            numberOfChildren?: string;
            numberOfHouseholds?: string;
            gender?: string | null;
            hobbies?: string;
            incomeCurrency?: string;
            timezone?: string;
            companyName?: string;
            orderBefore?: string;
            dateOfBirth?: string;
            age?: string;
            maritalStatus?: string;
        } | null;
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.memberAttributeValues': {
            storeEntityId?: string;
            memberAttributeValueId?: string;
            value?: string;
            memberAttribute?: components['schemas']['com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.memberAttributeValues.memberAttribute'];
        };
        'com.ibm.commerce.user.beans.UserSearchDataBean_IBM_User_List_Details.userDataBeans.memberAttributeValues.memberAttribute': {
            getName?: string;
            getDescription?: string;
            getMemberAttributeId?: string;
        };
        'com.ibm.commerce.approval.beans.OrderApprovalStatusListDataBean_IBM_Store_Summary.resultList': {
            recordSetCount?: number;
            recordSetStartNumber?: number;
            recordSetTotal?: number;
            resultList?: {
                approvalStatusId?: string;
                approverGroupId?: string;
                /** Format: date */
                submitTime?: string;
                flowTypeId?: string;
                stateId?: string;
                comment?: string;
                submitterId?: string;
                flowId?: string;
                /** Format: date */
                approveTime?: string;
                status?: string;
                approverId?: string;
                entityId?: string;
            }[];
            recordSetCompleteIndicator?: boolean;
        };
        /** @description Information about an organization entity identity. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler_OrgEntityIdentity': {
            /** @description The organization entity identifier. */
            orgEntityId: string;
            /** @description The address identifier of the organization entity. */
            addressId: string;
            viewTaskName?: string;
        };
        /** @description Request of OrgEntityAddCmd. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler_OrgEntityAddRequest': {
            /** @description Type of address, valid values are configurable by using a properties file: S (shipto), B (billto), and SB (both shipto and billto). A single address may be of different types. If a properties file cannot be found, a default of SB is used. */
            addressType?: string;
            /** @description The title of the user whose address is being entered (for example, Dr., Rev., Mr. or Ms.). */
            personTitle?: string;
            /** @description The name of the organization or organizational unit. Leading and trailing spaces is trimmed. When the system is configured with LDAP, the following characters are not allowed when the orgEntityName is used to construct the distinguished name: 1. The # character occurring at the beginning of orgEntityName. 2. Any of the following characters: = , + " \ < > ;. */
            orgEntityName: string;
            /** @description Code designating the method of code structure used for the billing code. The default value is D, assigned by buyer. */
            billingCodeType?: string;
            /** @description You can manage custom member attributes (MBRATTRVAL table) for this organization using the following syntax: &attributeName_storeId_action_number=value. */
            customMemberAttributes?: string[];
            /** @description The registrant's secondary e-mail or Web address. */
            email2?: string;
            /** @description The registrant's primary e-mail or Web address. */
            email1?: string;
            /** @description DN of the organization or organizational unit, for LDAP use. */
            distinguishedName: string;
            /** @description The name of the city where the registrant resides. */
            city?: string;
            /** @description The middle name of the administrator. */
            administratorMiddleName?: string;
            /** @description The middle name of the registrant. */
            middleName?: string;
            /** @description The last name of the administrator. */
            administratorLastName?: string;
            /** @description The name of the state, province, or equivalent where the registrant resides. */
            state?: string;
            /** @description Customizable field. */
            addressField1?: string;
            /** @description The registrant's secondary phone number. */
            phone2?: string;
            /** @description Customizable field. */
            addressField3?: string;
            /** @description Customizable field. */
            addressField2?: string;
            /** @description The registrant's secondary facsimile number. */
            fax2?: string;
            /** @description The registrant's primary facsimile number. */
            fax1?: string;
            /** @description The type of phone used for the registrant's primary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone1Type?: string;
            /** @description Customizable field. */
            orgEntityField1?: string;
            /** @description Customizable field. */
            orgEntityField2?: string;
            /** @description Customizable field. */
            orgEntityField3?: string;
            /** @description The type of phone used for the registrant's secondary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone2Type?: string;
            /** @description A description of the registrant. */
            description?: string;
            /** @description 1 - An indicator that the registrant's secondary phone number is listed; 0 - An indicator that the registrant's secondary phone number is unlisted. */
            publishPhone2?: string;
            /** @description A string used to identify the user for taxation purposes. */
            taxPayerId?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address1?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address2?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address3?: string;
            /** @description The ZIP or postal code of the registrant's address. */
            zipCode?: string;
            /** @description 1 - An indicator to include package inserts when the order is shipped; 0 - An indicator to not include package inserts when the order is shipped. There is no default for this field. If the field is left unused, it remains null in the database. */
            packageSuppression?: string;
            /** @description D - An indicator that daytime is the best time to call the registrant; E - An indicator that evening is the best time to call the registrant. */
            bestCallingTime?: string;
            /** @description The registrant's primary phone number. */
            phone1?: string;
            /** @description A tax code based on geographical region, especially useful with tax software. */
            taxGeoCode?: string;
            /** @description 1 - An indicator that the registrant's primary phone number is listed; 0 - An indicator that the registrant's primary phone number is unlisted. There is no default for these publishPhone fields. If the field is left unused, it remains null in the database. */
            publishPhone1?: string;
            /** @description The name of the unit within the organization that the registrant represents. */
            organizationUnitName?: string;
            /** @description The first name of the registrant. */
            firstName?: string;
            /** @description The name of the organization that the registrant represents. */
            organizationName?: string;
            /** @description Describes the kind of business performed by an organization or organizational unit. */
            businessCategory?: string;
            /** @description The registrant's preferred mode of delivery. */
            preferredDelivery?: string;
            /** @description A shipping code based on geographical region, especially useful with tax software. */
            shippingGeoCode?: string;
            /** @description The name of the country or region where the registrant resides. */
            country?: string;
            /** @description Required if orgEntityType equals 'OU': The member ID of the parent organizational entity where the new organizational entity is added. For an organization (orgEntityType=O), this parameter is not mandatory; it defaults to Root Organization. */
            parentMemberId: string;
            /** @description The first name of the administrator. */
            administratorFirstName?: string;
            /** @description The registrant's organization's code to identify the shipping or billing addresses and cost center. */
            billingCode?: string;
            /** @description Required if the authentication mode is LDAP: The last name of the registrant. If the authentication mode is LDAP, this parameter is mandatory. */
            lastName?: string;
            /** @description The type of the organizational entity being added. O - Organization; OU - Organizational Unit. */
            orgEntityType: string;
            /** @description Registered organization identifier; may be null for an organizational unit. */
            legalId?: string;
        };
        /** @description Request of OrgEntityUpdateCmd. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler_OrgEntityUpdateRequest': {
            /** @description Type of address, valid values are configurable by using a properties file: S (shipto), B (billto), and SB (both shipto and billto). A single address may be of different types. If a properties file cannot be found, a default of SB is used. */
            addressType?: string;
            /** @description The title of the user whose address is being entered (for example, Dr., Rev., Mr. or Ms.). */
            personTitle?: string;
            /** @description The name of the organization or organizational unit. */
            orgEntityName?: string;
            /** @description Code designating the method of code structure used for the billing code. The default value is D, assigned by buyer. */
            billingCodeType?: string;
            /** @description The ID for this organization or organizational unit. */
            orgEntityId: string;
            /** @description You can manage custom member attributes (MBRATTRVAL table) for this organization using the following syntax: &attributeName_storeId_action_number=value. */
            customMemberAttributes?: string[];
            /** @description The registrant's secondary e-mail or Web address. */
            email2?: string;
            /** @description The registrant's primary e-mail or Web address. */
            email1?: string;
            /** @description The name of the city where the registrant resides. */
            city?: string;
            /** @description The middle name of the administrator. */
            administratorMiddleName?: string;
            /** @description The middle name of the registrant. */
            middleName?: string;
            /** @description The last name of the administrator. */
            administratorLastName?: string;
            /** @description Customizable field. */
            addressField3?: string;
            /** @description Customizable field. */
            addressField1?: string;
            /** @description The registrant's secondary phone number. */
            phone2?: string;
            /** @description The name of the state, province, or equivalent where the registrant resides. */
            state?: string;
            /** @description Customizable field. */
            addressField2?: string;
            /** @description The registrant's secondary facsimile number. */
            fax2?: string;
            /** @description The registrant's primary facsimile number. */
            fax1?: string;
            /** @description The type of phone used for the registrant's primary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone1Type?: string;
            /** @description Customizable field. */
            orgEntityField1?: string;
            /** @description Customizable field. */
            orgEntityField2?: string;
            /** @description Customizable field. */
            orgEntityField3?: string;
            /** @description The type of phone used for the registrant's secondary phone number, for example TTY for hearing impaired, PCM for pulse-coded modulation, or CEL for mobile. This is a field of 3 characters. */
            phone2Type?: string;
            /** @description A description of the registrant. */
            description?: string;
            /** @description 1 - An indicator that the registrant's secondary phone number is listed; 0 - An indicator that the registrant's secondary phone number is unlisted. */
            publishPhone2?: string;
            /** @description A string used to identify the user for taxation purposes. */
            taxPayerId?: string;
            /** @description The URL to call when the command completes successfully. */
            URL?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address1?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address2?: string;
            /** @description The registrant's street address, to a maximum of three lines of information. */
            address3?: string;
            /** @description The ZIP or postal code of the registrant's address. */
            zipCode?: string;
            /** @description 1 - An indicator to include package inserts when the order is shipped; 0 - An indicator to not include package inserts when the order is shipped. There is no default for this field. If the field is left unused, it remains null in the database. */
            packageSuppression?: string;
            /** @description D - An indicator that daytime is the best time to call the registrant; E - An indicator that evening is the best time to call the registrant. */
            bestCallingTime?: string;
            /** @description The registrant's primary phone number. */
            phone1?: string;
            /** @description A tax code based on geographical region, especially useful with tax software. */
            taxGeoCode?: string;
            /** @description 1 - An indicator that the registrant's primary phone number is listed; 0 - An indicator that the registrant's primary phone number is unlisted. There is no default for these publishPhone fields. If the field is left unused, it remains null in the database. */
            publishPhone1?: string;
            /** @description The name of the unit within the organization that the registrant represents. */
            organizationUnitName?: string;
            /** @description The first name of the registrant. */
            firstName?: string;
            /** @description The name of the organization that the registrant represents. */
            organizationName?: string;
            /** @description Describes the kind of business performed by an organization or organizational unit. */
            businessCategory?: string;
            /** @description The registrant's preferred mode of delivery. */
            preferredDelivery?: string;
            /** @description A shipping code based on geographical region, especially useful with tax software. */
            shippingGeoCode?: string;
            /** @description The name of the country or region where the registrant resides. */
            country?: string;
            /** @description The first name of the administrator. */
            administratorFirstName?: string;
            /** @description The registrant's organization's code to identify the shipping or billing addresses and cost center. */
            billingCode?: string;
            /** @description Required if the authentication mode is LDAP: The last name of the registrant. If the authentication mode is LDAP, this parameter is mandatory. */
            lastName?: string;
            /** @description Registered organization identifier; may be null for an organizational unit. */
            legalId?: string;
        };
        /** @description Information about an organization entity identity. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler_UpdateApprovalGroups': {
            /** @description The URL to call when the command completes successfully. */
            URL: string;
            /** @description The organization entity identifier. */
            orgEntityId: string;
            /** @description The ApprovalGroup identifier for a specific organization. */
            segmentId: string;
        };
        /** @description Information about an organization entity identity. */
        'com.ibm.commerce.rest.member.handler.OrganizationHandler_UpdateApprovalGroupsResponse': {
            viewTaskName?: string;
        };
        'com.ibm.commerce.user.beans.OrganizationSearchDataBean_IBM_Organization_List_Details': {
            /** Format: int32 */
            pageNumber?: number;
            /** Format: int32 */
            pageSize?: number;
            /** Format: int32 */
            recordSetCount?: number;
            /** Format: int32 */
            recordSetTotal?: number;
            organizationHierarchy?: string[];
            recordSetCompleteIndicator?: boolean;
            organizationDataBeans?: components['schemas']['com.ibm.commerce.user.beans.OrganizationSearchDataBean_IBM_Organization_List_Details.organizationDataBeans'][];
            roleDataBeans?: components['schemas']['com.ibm.commerce.user.beans.OrganizationSearchDataBean_IBM_Organization_List_Details.roleDataBeans'][];
        };
        'com.ibm.commerce.user.beans.OrganizationSearchDataBean_IBM_Organization_List_Details.roleDataBeans': {
            description: string | null;
            displayName: string;
            roleId: string;
            name: string;
        };
        'com.ibm.commerce.user.beans.OrganizationSearchDataBean_IBM_Organization_List_Details.organizationDataBeans': {
            administratorFirstName?: string;
            administratorLastName?: string;
            administratorMiddleName?: string;
            businessCategory?: string | null;
            description?: string | null;
            displayName?: string;
            distinguishedName?: string;
            legalId?: string | null;
            memberId?: string;
            orgEntityField1?: string;
            orgEntityField2?: string;
            orgEntityField3?: string;
            orgEntityType?: string;
            organizationId?: string;
            organizationName?: string;
            /** Format: int64 */
            owner?: number;
            ownerMemberId?: string;
            parentMemberId?: string;
            preferredDelivery?: string;
            roles?: number[];
            state?: string;
            status?: string;
            /** @description A string used to identify the user for taxation purposes. */
            taxPayerId?: string;
            type?: string;
        };
        /** @description Request body to activate the user account. */
        'com.ibm.commerce.rest.member.handler.UserActivateHandler.ActiveUserRequestBody': {
            /** @description The user's logon ID. */
            logonId: string;
            /** @description The account validation code. */
            validationCode: string;
        };
        /** @description Response body to activate the user account. */
        'com.ibm.commerce.rest.member.handler.UserActivateHandler.ActiveUserResponse': {
            /** @description The redirect URL. */
            redirecturl: string;
            /** @description The user's logon ID. */
            logonId: string;
            /** @description The view task name. */
            viewTaskName: string;
            /** @description The store identifier. */
            storeId?: string;
            /** @description The language ID. */
            langId?: string;
        };
        /** @description Request body for resend user account activation email. */
        'com.ibm.commerce.rest.member.handler.UserActivateHandler.ResendActiveUserRequestBody': {
            /** @description An alternative email that the user account activation email can be sent to. */
            email1?: string;
            /** @description The user's logon ID. */
            logonId: string;
            /** @description The user's logon password. */
            logonPassword: string;
        };
        ErrorMessageResponseContainer: {
            errors?: components['schemas']['ErrorMessageResponse'][];
        };
        ErrorMessageResponse: {
            /** @description The error message key. */
            errorKey?: string;
            errorParameters?: string[];
            /** @description A descriptive error message. */
            errorMessage?: string;
            /** @description The error message code. */
            errorCode?: string | null;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}

export type $defs = Record<string, never>;

export interface operations {
    getAllPersonContact: {
        parameters: {
            query?: {
                /** @description The addressType to filter contacts by. All contacts will be returned if a valid value is not supplied for this parameter. */
                addressType?: 'Shipping' | 'Billing' | 'ShippingAndBilling';
                /** @description The response format. Valid values are json and xml. If the request contains an input body, it must use the format specified in responseFormat. If the responseFormat is not specified, the accept  HTTP header determines the format of the response. If the accept  HTTP header is not specified then default response format is json. */
                responseFormat?: 'xml' | 'json';
            };
            header?: never;
            path: {
                /** @description The store identifier. */
                storeId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested completed successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    'application/json': components['schemas']['person-contact'];
                    'application/xml': components['schemas']['person-contact'];
                    'application/xhtml+xml': components['schemas']['person-contact'];
                    'application/atom+xml': components['schemas']['person-contact'];
                };
            };
            /** @description Bad request. The request could not be understood by the server due to malformed syntax. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not authenticated. The user session is not valid. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The user is not authorized to perform the specified request. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. For details, see the server log files. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    addPersonContact: {
        parameters: {
            query?: {
                /** @description The response format. Valid values are json and xml. If the request contains an input body, it must use the format specified in responseFormat. If the responseFormat is not specified, the accept  HTTP header determines the format of the response. If the accept  HTTP header is not specified then default response format is json. */
                responseFormat?: 'xml' | 'json';
            };
            header?: never;
            path: {
                /** @description The store identifier. */
                storeId: string;
            };
            cookie?: never;
        };
        /** @description Request body. */
        requestBody?: {
            content: {
                'application/json': components['schemas']['person-singleContact'];
                'application/xml': components['schemas']['person-singleContact'];
            };
        };
        responses: {
            /** @description No response was specified. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    'application/json': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                    'application/xml': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                    'application/xhtml+xml': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                    'application/atom+xml': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                };
            };
            /** @description The requested resource has been created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Bad request. The request could not be understood by the server due to malformed syntax. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not authenticated. The user session is not valid. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The user is not authorized to perform the specified request. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. For details, see the server log files. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    findPersonContactById: {
        parameters: {
            query?: {
                /** @description The response format. Valid values are json and xml. If the request contains an input body, it must use the format specified in responseFormat. If the responseFormat is not specified, the accept  HTTP header determines the format of the response. If the accept  HTTP header is not specified then default response format is json. */
                responseFormat?: 'xml' | 'json';
            };
            header?: never;
            path: {
                /** @description The store identifier. */
                storeId: string;
                /** @description The address identifier. */
                addressId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested completed successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    'application/json': components['schemas']['person-singleContact'];
                    'application/xml': components['schemas']['person-singleContact'];
                    'application/xhtml+xml': components['schemas']['person-singleContact'];
                    'application/atom+xml': components['schemas']['person-singleContact'];
                };
            };
            /** @description Bad request. The request could not be understood by the server due to malformed syntax. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not authenticated. The user session is not valid. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The user is not authorized to perform the specified request. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The specified resource could not be found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. For details, see the server log files. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    findPersonContactByNickName: {
        parameters: {
            query?: {
                /** @description The response format. Valid values are json and xml. If the request contains an input body, it must use the format specified in responseFormat. If the responseFormat is not specified, the accept  HTTP header determines the format of the response. If the accept  HTTP header is not specified then default response format is json. */
                responseFormat?: 'xml' | 'json';
            };
            header?: never;
            path: {
                /** @description The store identifier. */
                storeId: string;
                /** @description The contact name saved in addressBook by registered shopper. */
                nickName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested completed successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    'application/json': components['schemas']['person-singleContact'];
                    'application/xml': components['schemas']['person-singleContact'];
                    'application/xhtml+xml': components['schemas']['person-singleContact'];
                    'application/atom+xml': components['schemas']['person-singleContact'];
                };
            };
            /** @description Bad request. The request could not be understood by the server due to malformed syntax. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not authenticated. The user session is not valid. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The user is not authorized to perform the specified request. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The specified resource could not be found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. For details, see the server log files. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    updatePersonContact: {
        parameters: {
            query?: {
                /** @description The response format. Valid values are json and xml. If the request contains an input body, it must use the format specified in responseFormat. If the responseFormat is not specified, the accept  HTTP header determines the format of the response. If the accept  HTTP header is not specified then default response format is json. */
                responseFormat?: 'xml' | 'json';
            };
            header?: never;
            path: {
                /** @description The store identifier. */
                storeId: string;
                /** @description The contact name saved in addressBook by registered shopper. */
                nickName: string;
            };
            cookie?: never;
        };
        /** @description Request body. */
        requestBody?: {
            content: {
                'application/json': components['schemas']['person-singleContact'];
                'application/xml': components['schemas']['person-singleContact'];
            };
        };
        responses: {
            /** @description The requested completed successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    'application/json': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                    'application/xml': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                    'application/xhtml+xml': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                    'application/atom+xml': components['schemas']['com.ibm.commerce.rest.member.handler.PersonContactHandler.UserIdentifier'];
                };
            };
            /** @description Bad request. The request could not be understood by the server due to malformed syntax. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not authenticated. The user session is not valid. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The user is not authorized to perform the specified request. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The specified resource could not be found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. For details, see the server log files. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deletePersonContact: {
        parameters: {
            query?: {
                /** @description The response format. Valid values are json and xml. If the request contains an input body, it must use the format specified in responseFormat. If the responseFormat is not specified, the accept  HTTP header determines the format of the response. If the accept  HTTP header is not specified then default response format is json. */
                responseFormat?: 'xml' | 'json';
            };
            header?: never;
            path: {
                /** @description The store identifier. */
                storeId: string;
                /** @description The contact name saved in addressBook by registered shopper. */
                nickName: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The requested completed successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    'application/json': components['schemas']['person-DeleteContact'];
                    'application/xml': components['schemas']['person-DeleteContact'];
                    'application/xhtml+xml': components['schemas']['person-DeleteContact'];
                    'application/atom+xml': components['schemas']['person-DeleteContact'];
                };
            };
            /** @description Bad request. The request could not be understood by the server due to malformed syntax. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Not authenticated. The user session is not valid. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The user is not authorized to perform the specified request. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description The specified resource could not be found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Internal server error. For details, see the server log files. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
