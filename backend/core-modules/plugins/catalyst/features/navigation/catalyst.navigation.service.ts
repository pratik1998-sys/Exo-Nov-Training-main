import { RequestContext } from "@context/request";
import { FooterNavigation, HeaderNavigation, NavigationErrors, NavigationService } from "@feature-navigation";

import { BasePluginServiceImpl } from "@plugin/service";
import { CatalystNavigationConsumerConfiguration, CatalystNavigationConsumerOption } from "core-modules/plugins/catalyst/features/navigation/types/catalyst.configuration.type";

export class CatalystNavigationServiceImpl extends BasePluginServiceImpl implements NavigationService {
    async getHeaderNavigation(requestContext: RequestContext, context?: any): Promise<HeaderNavigation> {
        const methodname = `${CatalystNavigationServiceImpl.name}.getHeaderNavigation`;

        const consumerId = this.getConsumerId(requestContext);

        const { mainNavigation, quickNavigation } = this.fetchNavigation(requestContext);

        const headerNavigation = mainNavigation.map((option) => {
            const label = option.label.find((label) => label.locale === requestContext.locale);

            return {
                id: option.id,
                url: option.url,
                label: label?.value ?? option.id,
            };
        });

        const quickNavigationItems = quickNavigation.map((option) => {
            const label = option.label.find((label) => label.locale === requestContext.locale);

            return {
                id: option.id,
                url: option.url,
                label: label?.value ?? option.id,
            };
        });

        return {
            mainNavigationItems: headerNavigation,
            quickNavigationItems: quickNavigationItems,
        };
    }

    async getFooterNavigation(requestContext: RequestContext, context?: any): Promise<FooterNavigation> {
        const methodname = `${CatalystNavigationServiceImpl.name}.getFooterNavigation`;

        return null;
    }

    protected fetchNavigation(requestContext: RequestContext): { mainNavigation: CatalystNavigationConsumerOption[], quickNavigation: CatalystNavigationConsumerOption[] } {
        const { configuration } = this.getPluginConsumerConfiguration<CatalystNavigationConsumerConfiguration>(requestContext);

        const { mainNavigation, quickNavigation } = configuration;

        return { mainNavigation: mainNavigation ?? [], quickNavigation: quickNavigation ?? [] };
    }
}
