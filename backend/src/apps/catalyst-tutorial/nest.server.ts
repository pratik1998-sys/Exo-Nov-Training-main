
import { ExtApplicationModule } from './application.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestServer } from '@server';

/**
 * The base NestServer has all methods protected or public, for complete overriding
 * capabilities to get your  application the flexibility it needs (such as including
 * non- framework modules)
 */
export class ExtNestServer extends NestServer {
    protected static appDirectory = __dirname;

    static async createServer() {
        await super.createServer();
    }

    /**
     * Add any providers, imports, exports to the appModule to be leveraged in the
     * application
     *
     * @param configuration
     * @returns
     */
    protected static async createApplicationModule(configuration: any) {
        //const appModule = await super.createApplicationModule(configuration);

        return await ExtApplicationModule.forRootAsync(this.appDirectoryName, this.appDirectory, configuration);
    }

    /**
     * Need to update Swagger configuration? Create an extension class of SwaggerInitializer, and
     * call the initializeSwagger(...) method of that extension class here, instead of
     * super.initializeAppSwager(...)
     *
     * @param configuration
     * @param appModule
     * @param app
     */
    protected static initializeAppSwagger(configuration: any, appModule: ExtApplicationModule, app: NestFastifyApplication) {
        //SwaggerInitializer.initializeSwagger(configuration, app);

        super.initializeAppSwagger(configuration, appModule, app);
    }

    protected static logASCIIBanner() {
        const banner = `

             ██████╗ █████╗ ████████╗ █████╗ ██╗  ██╗   ██╗███████╗████████╗  ██╗███████╗
            ██╔════╝██╔══██╗╚══██╔══╝██╔══██╗██║  ╚██╗ ██╔╝██╔════╝╚══██╔══╝  ██║██╔════╝
            ██║     ███████║   ██║   ███████║██║   ╚████╔╝ ███████╗   ██║     ██║███████╗
            ██║     ██╔══██║   ██║   ██╔══██║██║    ╚██╔╝  ╚════██║   ██║██   ██║╚════██║
            ╚██████╗██║  ██║   ██║   ██║  ██║███████╗██║   ███████║   ██║╚█████╔╝███████║
             ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝   ╚═╝ ╚════╝ ╚══════╝
                                                              An IBM Consulting Framework
        `;

        this.logger.log(banner);
    }
}
