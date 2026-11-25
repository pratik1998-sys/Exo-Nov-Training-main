import { ApplicationModule } from '@application';
import { ConfigService } from '@nestjs/config';

/**
 * Use this extension app module to customize the application configurations
 */
export class ExtApplicationModule extends ApplicationModule {
    /**
     * Note: Apollo Landing Configuration seems to be cached in browser, so any updates will
     * not reflect until browser cache is cleared, or, a new incognito window is opened
     *
     * @param config
     * @returns
     */
    protected static composeApolloLandingPageConfiguration(config: ConfigService) {
        const methodname = `${ExtApplicationModule.name}.composeApolloLandingPageConfiguration`;

        return super.composeApolloLandingPageConfiguration(config);
    }

    protected static getGraphqlPlugins(config: ConfigService) {
        const methodname = `${ExtApplicationModule.name}.getGraphqlPlugins`;

        return super.getGraphqlPlugins(config);
    }

    // As this is an EXOAppModule extension, we need to override the core `getEXOAppModule()` method to return this
    // extension class' static property module.
    protected getEXOAppModule() {
        return ExtApplicationModule.module;
    }
}
