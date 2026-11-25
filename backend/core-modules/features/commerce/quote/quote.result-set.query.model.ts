import { Field } from '@api-decorators';
import { ApiProperty } from '@nestjs/swagger';
import { ResultSetQueryType } from '@feature/controller/types';
import { ItemFilterInput } from '@feature-commerce/common';
import { ResultSetQuery } from '@feature/controller/models';

export class QuoteResultSetQuery extends ResultSetQuery {
    @Field({ description: 'item ids - comma delimited', required: false })
    itemIds?: string;

    @ApiProperty({ description: 'item slugs - comma delimited', required: false })
    itemSlugs?: string;

    @ApiProperty({ description: 'item identifiers - comma delimited', required: false })
    itemIdentifiers?: string;
}

export interface QuoteResultSetQueryType extends ResultSetQueryType {
    filter?: ItemFilterInput;
}
