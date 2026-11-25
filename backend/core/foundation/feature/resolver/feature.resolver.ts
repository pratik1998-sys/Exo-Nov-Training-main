import { OnModuleInit } from "@nestjs/common";
import { RequestContext } from "@context/request";
import { BaseFeatureComponent } from "@feature/base/feature.component";
import { BaseFeatureModule } from "@feature/module";
import { FeatureSubscriptionMessenger } from "@feature/subscription-pubsubs";

export abstract class BaseFeatureResolver
  extends BaseFeatureComponent
  implements OnModuleInit
{
  protected static queryFeatureSubscriptionMessengers: Record<
    string,
    FeatureSubscriptionMessenger
  > = {};

  protected getRequestContext(context: any): RequestContext {
    const request = this.getRequest(context);

    return request.requestContext ? request.requestContext : {};
  }

  protected getRequest(context): any {
    return context?.raw ? context.raw : {};
  }

  /**
   * This is static to execute from decorator methods
   *
   * This fetches the implementation fo the
   *
   * @param query
   * @returns
   */
  protected static getQueryFeatureSubscriptionMessenger(
    query: string,
  ): FeatureSubscriptionMessenger {
    const methodname = `${BaseFeatureResolver.name}.getQueryFeatureSubscriptionMessenger`;

    if (!this.queryFeatureSubscriptionMessengers[query]) {
      const token = BaseFeatureModule.composeFeatureSubscriptionQueryToken(
        query,
        this.feature.id,
      );

      try {
        this.queryFeatureSubscriptionMessengers[query] = this.moduleRef.get(
          token,
          { strict: false },
        );
      } catch (error) {
        this.logger.info(
          `${methodname} - Did not find query subscripion pubsub for feature: ${this.feature.id}, query: ${query}, token: ${token}`,
        );
      }
    }

    return this.queryFeatureSubscriptionMessengers[query];
  }
}
