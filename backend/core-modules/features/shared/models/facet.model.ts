import { Field, FieldType } from '@api-decorators';
import { ObjectType, InputType } from '@nestjs/graphql';

const { integer } = FieldType;

@InputType({ description: 'Facet Range Input' })
export class FacetRangeInput {
    @Field({
        description: 'Range floor',
    })
    from: string;

    @Field({
        description: 'Range Ceiling',
    })
    to: string;
}

@InputType({ description: 'Facet Input' })
export class FacetInput {
    @Field({ description: 'facet id to include in filter' })
    id: string;

    @Field({
        type: () => [String],
        description: 'facet values that should be filtered on',
    })
    values?: string[];

    @Field({
        type: () => [FacetRangeInput],
        description: 'facet values that should be filtered on',
    })
    ranges?: FacetRangeInput[];
}

@ObjectType({ description: 'Facet Range' })
export class FacetRange {
    @Field({ description: 'range floor' })
    from?: string;

    @Field({ description: 'range ceiling' })
    to?: string;
}

@ObjectType({ description: 'Facet Value' })
export class FacetValue {
    @Field({ description: 'facet value id' })
    id?: string;

    @Field({ description: 'Facet value label' })
    label?: string;

    @Field(
        {
            description: 'count of entities with facet value',
        },
        integer,
    )
    count?: number;

    @Field({
        type: () => Boolean,
        description: 'Is facet value currently applied as a filter',
    })
    isSelected?: boolean;

    @Field({
        type: () => FacetRange,
        description: 'Facet value range, if type is a range type',
    })
    range?: FacetRange;
}

@ObjectType({ description: 'Facet' })
export class Facet {
    @Field({ description: 'facet id' })
    id?: string;

    @Field({ description: 'label for a facet' })
    label?: string;

    @Field({ description: 'facet type' })
    type?: string;

    @Field({ type: () => Boolean, description: 'is range' })
    isRange?: boolean;

    @Field({
        type: () => Boolean,
        description: 'describes if this facet can have multiple selections',
    })
    isMultiSelect?: boolean;

    @Field({
        type: () => [FacetValue],
        description: 'available values for this facet',
    })
    values?: FacetValue[];
}
