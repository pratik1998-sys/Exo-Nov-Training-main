import { RequestContext } from "@context/request";
import { UILayout, UILayoutErrors, UILayoutService } from "@feature-ui-layout";
import { AdobeAEMBaseServiceImpl, AdobeAEMConsumerConfiguration } from "@plugin-adobe-aem/common";
import { AdobeAEMUILayoutDatasource } from "./adobe-aem.ui-layout.datasource";
import { UILayoutMapper } from "./adobe-aem.ui-layout.mapper";
import { StringUtility } from "@utilities";

export class AdobeAEMUILayoutServiceImpl extends AdobeAEMBaseServiceImpl implements UILayoutService {
    protected getMapperType() { }

    async getUILayout(id: string, type: string, requestContext: RequestContext, context?: any): Promise<UILayout> {
        const methodname = `${AdobeAEMUILayoutServiceImpl.name}.getUILayout`;

        let result = null;

        const { configuration } = this.getPluginConsumerConfiguration<AdobeAEMConsumerConfiguration>(requestContext);
        const layoutId = this.formatUILayoutId(id || type || 'home', requestContext);

        try {
            result = await this
                .getDatasource<AdobeAEMUILayoutDatasource>(requestContext)
                .getLayoutById(requestContext, this.buildPathRoot(configuration.appRootPath, requestContext), layoutId);
        } catch (error) {
            this.logger.info(`${methodname} - Error fetching layout with id ${layoutId}: ${error}`, requestContext);
            throw UILayoutErrors.getLayoutFailed();
        }


        // const mappedResult = UILayoutMapper.mapUILayout(requestContext, result);
        // mappedResult.data = {
        //     ...mappedResult.data,
        //     raw: result,
        // };

        // return mappedResult;

        return {
            data: result,
        };
    }

    // protected formatUILayoutId(id: string, requestContext: RequestContext) {
    //     const { aemSiteId } = this.getPluginConsumerConfiguration<AdobeAEMConsumerConfiguration>(requestContext);

    //     const pathDelimiter = '/';

    //     if (aemSiteId) {
    //         const arr = id.split(pathDelimiter);

    //         //Id will start with the AEM/NextJS langague ie en/home. If siteId exists in configuraiton, this needs to
    //         //transform to include the siteId after the language, ie en/01-home/..
    //         if (arr.length >= 2) {
    //             arr[1] = `${aemSiteId}-${arr[1]}`;
    //         }

    //         id = arr.join(pathDelimiter);
    //     }

    //     return id;
    // }

    protected formatUILayoutId(id: string, requestContext: RequestContext) {
        const { aemSiteId } = this.getPluginConsumerConfiguration<AdobeAEMConsumerConfiguration>(requestContext);

        id = `${requestContext.language}/${id}`;

        if (StringUtility.isStringNotEmpty(aemSiteId)) {
            id = `${aemSiteId}/${id}`;
        }

        return id;
    }

    protected buildPathRoot(pathRoot: string, requestContext: RequestContext) {
        const { aemAppId } = this.getPluginConsumerConfiguration<AdobeAEMConsumerConfiguration>(requestContext);

        return pathRoot.replace(this.pathParams.appId, aemAppId);
    }
}
