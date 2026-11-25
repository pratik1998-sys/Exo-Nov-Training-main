import { BaseDatasourcePluginServiceImpl } from "@plugin/service";

export abstract class AdobeAEMBaseServiceImpl extends BaseDatasourcePluginServiceImpl {
    protected readonly pathParams = {
        appId: ':appId',
        siteId: ':siteId',
        language: ':language',
    };
}
