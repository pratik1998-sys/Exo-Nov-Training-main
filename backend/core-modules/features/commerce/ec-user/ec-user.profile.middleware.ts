import { RequestContext } from '@context/request';
import { ECUser } from './ec-user.model';
import { ECUserService } from './ec-user.service';
import { UserProfileMiddleware } from '@feature-user';

export class ECUserProfileMiddleware extends UserProfileMiddleware {
    protected getClass() {
        return ECUserProfileMiddleware;
    }

    // constructor(
    //     protected configService: ConfigService,
    //     protected moduleRef: ModuleRef,
    //     protected cacheManager: Cache,
    //     @Inject(LoggerKey) protected logger: Logger,
    //     @Optional() consumerIds: string[] = [],
    //     @Optional() isAdmin: boolean = false,
    // ) {
    //     super(configService, moduleRef, cacheManager, logger, consumerIds, isAdmin);
    // }

    protected async fetchUser(requestContext: RequestContext): Promise<ECUser> {
        const userService = this.getECUserService(requestContext);

        return await userService.getUser(null, requestContext);
    }

    protected getTokenId(requestContext: RequestContext): string {
        const userService = this.getECUserService(requestContext);

        return userService.getTokenPurseId(requestContext);
    }

    protected getECUserService(requestContext: RequestContext): ECUserService {
        return this.getService<ECUserService>(requestContext, ECUserService);
    }
}
