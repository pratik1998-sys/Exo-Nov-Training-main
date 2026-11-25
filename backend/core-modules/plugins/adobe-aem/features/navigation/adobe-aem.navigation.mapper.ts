import { RequestContext } from "@context/request";
import { FooterNavigation, HeaderNavigation, NavigationItem } from "@feature-navigation";
import { BaseMapper } from "@plugin/mapper";

export class AdobeAEMNavigationMapper extends BaseMapper {
    mapHeaderNavigation(requestContext: RequestContext, result: any): HeaderNavigation {
        const headerNavigation: HeaderNavigation = {
            mainNavigationItems: [],
            quickNavigationItems:
                result.topLinksList ?
                    result.topLinksList.map((dsLink, i) => {
                        return this.mapNavigationLink(requestContext, dsLink);
                    })
                    : [],
        };

        return headerNavigation;
    }

    mapFooterNavigation(requestContext: RequestContext, result: any): FooterNavigation {
        const footerNavigation: FooterNavigation = {
            mainNavigationItems: [],
            quickNavigationItems:
                result.topLinksList ?
                    result.topLinksList.map((dsLink, i) => {
                        return this.mapNavigationLink(requestContext, dsLink);
                    })
                    : [],
        };

        return footerNavigation;
    }

    mapNavigationLink(requestContext: RequestContext, dsLink: any): NavigationItem {
        const navigationItem: NavigationItem = {
            label: dsLink.linkText,
            description: dsLink.linkDescription,
            url: dsLink.linkUrl,
            isButton: dsLink.isButton,
            isInternalNavigation: dsLink.linkUrl?.startsWith('/'),
            target: dsLink.openInNewWindow ? '_blank' : '_self',
            icon: null,
            navigationItems: null,
        };

        return navigationItem;
    }
}
