import { Field, FieldType } from '@api-decorators';
import { ObjectType } from '@nestjs/graphql';

const { id } = FieldType;

@ObjectType({ description: ' Entity' })
export class Entity {
    @Field({ description: 'id', required: false }, id)
    id?: string;

    @Field({ description: 'identifier', required: false })
    identifier?: string;

    @Field({ description: 'name', required: false })
    name?: string;

    @Field({ description: 'description', required: false })
    description?: string;
}
