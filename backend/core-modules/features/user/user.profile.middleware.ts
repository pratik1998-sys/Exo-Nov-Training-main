import { MiddlewareConfigurationConfig } from '@configuration/types';
import { User, UserService } from '@feature-user';
import { BaseMiddleware } from '@middleware-foundation';
import { RequestContext } from '@context/request';
import { ServiceUtility } from '@plugin/service/utilities/service.utility';

export interface UserProfileMiddlewareConsumerConfiguration extends MiddlewareConfigurationConfig {
    cacheTTL: number;
}

export interface UserProfileMiddlewareUserCache {
    expiresOn: number;
    user: User;
}

export class UserProfileMiddleware extends BaseMiddleware {
    protected getClass() {
        return UserProfileMiddleware;
    }

    // constructor(
    //     protected configService: ConfigService,
    //     protected moduleRef: ModuleRef,
    //     protected cacheManager: Cache,
    //     @Inject(LoggerKey) protected logger: Logger,
    //     @Optional() consumerIds: string[] = [],
    //     @Optional() isAdmin: boolean = false,
    // ) {
    //     const methodname = `${UserProfileMiddleware.name}()`;

    //     super(configService, moduleRef, cacheManager, logger, consumerIds, isAdmin);
    // }

    protected async execute(req: any, res: any, next: () => void) {
        const methodname = `${UserProfileMiddleware.name}.execute`;

        const requestContext = this.getRequestContext(req);

        const consumerConfiguration = this.getConsumerMiddlewareConfiguration<UserProfileMiddlewareConsumerConfiguration>(requestContext.consumer);

        const { cacheTTL } = consumerConfiguration;

        const tokenId = this.getTokenId(requestContext);

        if (requestContext.tokens?.[tokenId]?.isRegistered) {
            let user: User;

            const cacheKey = `user_profile:${requestContext.tokens[tokenId].token}`;

            //CacheManager module expires automatically after 300000ms - this is a safety net for
            //the app alotted memory. Individual entities may need to be refreshed sooner, like user
            user = await this.cacheManager.get<User>(cacheKey);

            if (user == null) {
                this.logger.info(`${methodname} - Fetching user profile [plugin]`);

                user = await this.fetchUser(requestContext);

                await this.cacheManager.set(cacheKey, user, cacheTTL);
            } else {
                this.logger.info(`${methodname} - Fetching user profile [cache]`);
            }

            requestContext.user = user;
        }

        next();
    }

    protected async fetchUser(requestContext: RequestContext): Promise<User> {
        return await this.getUserService(requestContext).getUser(null, requestContext);
    }

    protected getTokenId(requestContext: RequestContext): string {
        return this.getUserService(requestContext).getTokenId(requestContext);
    }

    protected getUserService(requestContext: RequestContext): UserService {
        return this.getService<UserService>(requestContext, UserService);
    }
}
