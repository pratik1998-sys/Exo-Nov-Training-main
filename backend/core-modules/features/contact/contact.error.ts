import { ErrorType } from '@error';
import { FeatureErrors, FeatureErrorsType } from '@feature/error';
import { HttpException } from '@nestjs/common';

export interface ContactErrorsType extends FeatureErrorsType {
    getContactsFailed: ErrorType;
    getContactFailed: ErrorType;
    createContactFailed: ErrorType;
    updateContactFailed: ErrorType;
    deleteContactFailed: ErrorType;
    contactExists: ErrorType;
    contactNotEditable: ErrorType;
}

export class ContactErrors extends FeatureErrors {
    protected static errors: ContactErrorsType = {
        ...FeatureErrors.errors,
        getContactsFailed: {
            code: 'CONTACTS_GET_FAILED',
            message: 'Get contacts failed',
            statusCode: 400,
        },
        getContactFailed: {
            code: 'CONTACT_GET_FAILED',
            message: 'Get contact failed',
            statusCode: 400,
        },
        createContactFailed: {
            code: 'CONTACT_CREATE_FAILED',
            message: 'Create contact failed',
            statusCode: 400,
        },
        updateContactFailed: {
            code: 'CONTACT_UPDATE_FAILED',
            message: 'Update contact failed',
            statusCode: 400,
        },
        deleteContactFailed: {
            code: 'CONTACT_DELETE_FAILED',
            message: 'Delete contact failed',
            statusCode: 400,
        },
        contactExists: {
            code: 'CONTACT_EXISTS',
            message: 'Contact alread exists',
            statusCode: 400,
        },
        contactNotEditable: {
            code: 'CONTACT_NOT_EDITABLE',
            message: 'Contact not editable',
            statusCode: 400,
        }
    }

    static getContactsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getContactsFailed);
    }

    static getContactFailed(): HttpException {
        return this.composeHTTPError(this.errors.getContactFailed);
    }

    static createContactFailed(): HttpException {
        return this.composeHTTPError(this.errors.createContactFailed);
    }

    static updateContactFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateContactFailed);
    }

    static deleteContactFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteContactFailed);
    }

    static contactExists(): HttpException {
        return this.composeHTTPError(this.errors.contactExists);
    }

    static contactNotEditable(): HttpException {
        return this.composeHTTPError(this.errors.contactNotEditable);
    }
}

