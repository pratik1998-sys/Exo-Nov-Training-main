import { Field } from '@api-decorators';
import { InputType } from '@nestjs/graphql';

@InputType({ description: 'Entity Filter Input' })
export class EntityFilterInput {
    @Field({ description: 'entity id to filter by' })
    id?: string;

    @Field({ description: 'entity identifier to filter by' })
    identifier?: string;

    @Field({ description: 'entity slug to filter by' })
    slug?: string;

    @Field({ type: () => [String], description: 'entity ids to filter by' })
    ids?: string[];

    @Field({ type: () => [String], description: 'entity identifiers to filter by' })
    identifiers?: string[];

    @Field({ type: () => [String], description: 'entity slugs to filter by' })
    slugs?: string[];
}
