import { RequestContext } from "@context/request";
import { FooterNavigation, HeaderNavigation, NavigationErrors, NavigationService } from "@feature-navigation";
import { AdobeAEMBaseServiceImpl } from "@plugin-adobe-aem/common";
import { AdobeAEMNavigationDatasource } from "./adobe-aem.navigation.datasource";
import { AdobeAEMNavigationMapper } from "./adobe-aem.navigation.mapper";

export class AdobeAEMNavigationServiceImpl extends AdobeAEMBaseServiceImpl implements NavigationService {
    async getHeaderNavigation(requestContext: RequestContext, context?: any): Promise<HeaderNavigation> {
        const methodname = `${AdobeAEMNavigationServiceImpl.name}.getHeaderNavigation`;

        let result = null;

        try {
            result = await this.getDatasource<AdobeAEMNavigationDatasource>(requestContext).getHeaderNavigation(
                requestContext
            );
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching header data: ${error}`);
            throw NavigationErrors.getHeaderFailed();
        }

        return this.getMapper<AdobeAEMNavigationMapper>(requestContext).mapHeaderNavigation(requestContext, result);
    }

    async getFooterNavigation(requestContext: RequestContext, context?: any): Promise<FooterNavigation> {
        const methodname = `${AdobeAEMNavigationServiceImpl.name}.getFooterNavigation`;

        let result = null;

        try {
            result = await this.getDatasource<AdobeAEMNavigationDatasource>(requestContext).getFooterNavigation(
                requestContext
            );
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching footer data: ${error}`);
            throw NavigationErrors.getFooterFailed();
        }

        return this.getMapper<AdobeAEMNavigationMapper>(requestContext).mapFooterNavigation(requestContext, result);
    }
}
