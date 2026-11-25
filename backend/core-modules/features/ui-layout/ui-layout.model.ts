import { Field, FieldType } from '@api-decorators';
import { createUnionType, ObjectType } from '@nestjs/graphql';
import { Image } from '@feature-shared-models';

const { integer, json } = FieldType;

export const UIComponentTypes = {
    banner: 'banner',
    text: 'text',
    slider: 'slider',
};

@ObjectType({ description: 'UI Text Align' })
export class UITextAlign {
    @Field({ description: 'text align vertial - top | bottom', required: false })
    vertical: string;

    @Field({ description: 'text align horizontal - left | right', required: false })
    horizontal: string;
}

@ObjectType({ description: 'UI Component' })
export class UIComponent {
    @Field({ description: 'component row', required: false }, integer)
    row?: number;

    @Field({ description: 'component column', required: false }, integer)
    column?: number;

    @Field({ description: 'component type', required: false })
    type: string;

    @Field({ description: 'component identifier', required: false })
    id?: string;
}

@ObjectType({ description: 'UI Text' })
export class UIText extends UIComponent {
    @Field({ description: 'banner header', required: false })
    header?: string;

    @Field({ description: 'banner subheader', required: false })
    subheader?: string;

    @Field({ description: 'banner description', required: false })
    description?: string;

    @Field({ type: () => UITextAlign, description: 'banner description', required: false })
    textAlign?: UITextAlign;
}

@ObjectType({ description: 'UI Banner' })
export class UIBanner extends UIComponent {
    @Field({ type: () => UIText, description: 'banner text', required: false })
    text?: UIText;

    @Field({ type: () => Image, description: 'banner image', required: false })
    image?: Image;
}

@ObjectType({ description: 'UI Slider' })
export class UISlider extends UIComponent {
    @Field({ type: () => [UIBanner], description: 'slides', required: false })
    slides: UIBanner[];
}

@ObjectType({ description: 'UI Generic Component' })
export class UIGeneric extends UIComponent {
    @Field({ description: 'component payload', required: false }, json)
    data?: object;
}

export const UIComponentUnion = createUnionType({
    name: 'UIComponentUnion',
    types: () => [UIBanner, UISlider, UIText, UIGeneric] as const,
    resolveType: (value) => {
        if (value.type == UIComponentTypes.banner) {
            return UIBanner;
        } else if (value.type == UIComponentTypes.text) {
            return UIText;
        } else if (value.type == UIComponentTypes.slider) {
            return UISlider;
        }

        return UIGeneric;
    },
});

@ObjectType({ description: 'UI Layout' })
export class UILayout {
    @Field({ description: 'navigation item identifier', required: false }, json)
    data?: object;

    @Field({ type: () => [UIComponentUnion], description: 'UI Layout Component Rows', required: false })
    rows?: Array<typeof UIComponentUnion>;
}

export class UILayoutRest {
    @Field({ description: 'navigation item identifier', required: false }, json)
    data?: object;
}
