import { Field } from '@api-decorators';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: ' Alert' })
export class Alert {
    @Field({ description: 'alert id' })
    id?: string;

    @Field({ description: 'alert identifier' })
    identifier?: string;

    @Field({ description: 'alert message' })
    message?: string;

    @Field({ description: 'alert severity' })
    severity?: string;
}
