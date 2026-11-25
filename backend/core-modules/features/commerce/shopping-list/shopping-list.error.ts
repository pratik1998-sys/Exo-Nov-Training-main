import { ErrorType } from '@error/error';
import { CommerceErrors, CommerceErrorsType } from '@feature-commerce/common';
import { HttpException } from '@nestjs/common';

export interface ShoppingListErrorsType extends CommerceErrorsType {
    getShoppingListsFailed: ErrorType;
    getShoppingListFailed: ErrorType;
    createShoppingListFailed: ErrorType;
    deleteShoppingListFailed: ErrorType;
    updateShoppingListFailed: ErrorType;
    missingShoppingListId: ErrorType;
    addShoppingListItemsFailed: ErrorType;
    updateShoppingListItemsFailed: ErrorType;
    deleteShoppingListItemsFailed: ErrorType;
    shoppingListItemExists: ErrorType;
}

export class ShoppingListErrors extends CommerceErrors {
    static errors: ShoppingListErrorsType = {
        ...CommerceErrors.errors,
        getShoppingListsFailed: {
            code: 'SHOPPING_LISTS_GET_FAILED',
            message: 'Get shopping lists failed',
            statusCode: 400,
        },
        getShoppingListFailed: {
            code: 'SHOPPING_LIST_GET_FAILED',
            message: 'Get shopping list failed',
            statusCode: 400,
        },
        createShoppingListFailed: {
            code: 'SHOPPING_LIST_CREATE_FAILED',
            message: 'Create shopping list failed',
            statusCode: 400,
        },
        deleteShoppingListFailed: {
            code: 'SHOPPING_LIST_DELETE_FAILED',
            message: 'Delete shopping list failed',
            statusCode: 400,
        },
        updateShoppingListFailed: {
            code: 'SHOPPING_LIST_UPDATE_FAILED',
            message: 'Update shopping list failed',
            statusCode: 400,
        },
        missingShoppingListId: {
            code: 'SHOPPING_LIST_MISSING_ID',
            message: 'Missing required shopping list id',
            statusCode: 400,
        },
        addShoppingListItemsFailed: {
            code: 'SHOPPING_LIST_ITEMS_ADD_FAILED',
            message: 'Add shopping list items failed',
            statusCode: 400,
        },
        updateShoppingListItemsFailed: {
            code: 'SHOPPING_LIST_ITEMS_UPDATE_FAILED',
            message: 'Update shopping list items failed',
            statusCode: 400,
        },
        deleteShoppingListItemsFailed: {
            code: 'SHOPPING_LIST_ITEMS_DELETE_FAILED',
            message: 'Delete shopping list items failed',
            statusCode: 400,
        },
        shoppingListItemExists: {
            code: 'SHOPPING_LIST_ITEM_EXISTS',
            message: 'Shopping list item already exists',
            statusCode: 400,
        },
    };

    static getShoppingListsFailed(): HttpException {
        return this.composeHTTPError(this.errors.getShoppingListsFailed);
    }

    static getShoppingListFailed(): HttpException {
        return this.composeHTTPError(this.errors.getShoppingListFailed);
    }

    static createShoppingListFailed(): HttpException {
        return this.composeHTTPError(this.errors.createShoppingListFailed);
    }

    static deleteShoppingListFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteShoppingListFailed);
    }

    static updateShoppingListFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateShoppingListFailed);
    }

    static missingShoppingListId(): HttpException {
        return this.composeHTTPError(this.errors.missingShoppingListId);
    }

    static addShoppingListItemsFailed(): HttpException {
        return this.composeHTTPError(this.errors.addShoppingListItemsFailed);
    }

    static updateShoppingListItemsFailed(): HttpException {
        return this.composeHTTPError(this.errors.updateShoppingListItemsFailed);
    }

    static deleteShoppingListItemsFailed(): HttpException {
        return this.composeHTTPError(this.errors.deleteShoppingListItemsFailed);
    }

    static shoppingListItemExists(): HttpException {
        return this.composeHTTPError(this.errors.shoppingListItemExists);
    }
}
