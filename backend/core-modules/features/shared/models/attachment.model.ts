import { Field } from '@api-decorators';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: ' Attachment' })
export class Attachment {
    @Field({ description: 'attachment id' })
    id?: string;

    @Field({ description: 'attachment name' })
    name?: string;

    @Field({ description: 'attachment type' })
    type?: string;

    @Field({ description: 'attachment mime-type' })
    mimeType?: string;

    @Field({ description: 'attachment URL' })
    url?: string;

    @Field({ description: 'attachment data' })
    data?: string;
}
