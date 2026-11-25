import { InputType, ObjectType } from '@nestjs/graphql';
import { Cart } from '@feature-commerce/cart';
import { Authenticate, AuthenticateGuest, AuthenticateGuestInput, AuthenticateInput } from '@feature-authenticate';
import { Field } from '@api-decorators';

@InputType({ description: 'Commerce Authentication Additional Attribute Inputs' })
export class ECAuthenticateAdditonalAttributes {
    @Field({ type: () => Boolean, description: 'fetch the users ecomm cart' })
    doCart?: boolean;

    @Field({ description: 'guest cart id to merge' })
    cartId?: string;
}

@ObjectType({ description: 'Commerce Authentication' })
export class ECAuthenticate extends Authenticate {
    @Field({ type: () => Cart, description: 'ecommerce cart, present if doCart:true' })
    cart?: Cart;
}

@ObjectType({ description: 'Commerce Authentication' })
export class ECAuthenticateGuest extends AuthenticateGuest { }

export class ECAuthenticateInput extends AuthenticateInput {
    @Field({ description: 'guest user cart id to merge to authenticated customer cart' })
    cartId: string;

    @Field({ type: () => Boolean, description: 'fetch the customer cart' })
    doCart: boolean;
}

export class ECAuthenticateGuestInput extends AuthenticateGuestInput { }
