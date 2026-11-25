import { InputType, ObjectType } from '@nestjs/graphql';
import { Field } from '@api-decorators';
import { AddressInput } from '@feature-address';
import { User, UserCreateInput, UserInput } from '@feature-user';
import { ECAuthenticate } from '../ec-authenticate/ec-authenticate.model';
import { ResultSet } from '@feature/models';

//TODO - Should this be a part of authentication or a part of customer/user? hmm...
@InputType({ description: 'ECUser Input' })
export class ECUserInput extends UserInput { }

@InputType({ description: 'ECUser Create Input' })
export class ECUserCreateInput extends UserCreateInput {
    @Field({ type: () => [AddressInput], required: false, description: 'user addresses' })
    addresses?: AddressInput[];
}

@ObjectType({ description: 'ECUser' })
export class ECUser extends User { }

@ObjectType({ description: 'ECUser Create' })
export class ECUserCreate extends ECUser {
    @Field({ type: () => ECAuthenticate, description: 'authentication' })
    authenticate: ECAuthenticate;
}

@ObjectType({ description: 'ECUser Result Set' })
export class ECUserResultSet extends ResultSet<ECUser> {
    @Field({ type: () => [ECUser], description: 'user results' })
    results?: ECUser[];
}

export class ECUserCreateBodyInput extends ECUserCreateInput {
    @Field({ description: 'cart id' })
    cartId?: string;
}
