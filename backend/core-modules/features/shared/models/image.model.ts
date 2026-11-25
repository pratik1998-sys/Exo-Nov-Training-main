import { Field } from '@api-decorators';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Image' })
export class Image {
    @Field({ description: 'Image URL' })
    url?: string;

    @Field({ description: 'Image alt text for accessibility' })
    altText?: string;
}
