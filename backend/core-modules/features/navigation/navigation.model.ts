import { Field } from '@api-decorators';
import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Navigation Item' })
export class NavigationItem {
    @Field({ description: 'navigation item identifier', required: false })
    identifier?: string;

    @Field({ description: 'navigation item label', required: false })
    label: string;

    @Field({ description: 'navigation item description', required: false })
    description?: string;

    @Field({ description: 'navigation item url', required: false })
    url?: string;

    @Field({ description: 'navigation item icon', required: false })
    icon?: string;

    @Field({ type: () => Boolean, description: 'navigation item is a button', required: false })
    isButton?: boolean;

    @Field({ type: () => Boolean, description: 'navigation is within the application domain', required: false })
    isInternalNavigation?: boolean;

    @Field({ description: 'navigation target (_self or _blank)', required: false })
    target?: string;

    @Field({ description: 'navigation type (ie page, category, etc)', required: false })
    type?: string;

    @Field({ type: () => [NavigationItem], description: 'navigation subnavigation items', required: false })
    navigationItems?: NavigationItem[];
}

@ObjectType({ description: 'Header Navigation' })
export class HeaderNavigation {
    @Field({ type: () => [NavigationItem], description: 'header main navigation', required: false })
    mainNavigationItems: NavigationItem[];

    @Field({ type: () => [NavigationItem], description: 'header quick navigation', required: false })
    quickNavigationItems: NavigationItem[];
}

@ObjectType({ description: 'Footer Navigation' })
export class FooterNavigation {
    @Field({ type: () => [NavigationItem], description: 'footer main navigation', required: false })
    mainNavigationItems: NavigationItem[];

    @Field({ type: () => [NavigationItem], description: 'footer quick navigation', required: false })
    quickNavigationItems: NavigationItem[];
}
