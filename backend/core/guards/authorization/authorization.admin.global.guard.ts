import { AuthorizationGuard } from "@guards/authorization";
import { ExecutionContext } from "@nestjs/common";

export class AuthorizationAdminGuard extends AuthorizationGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const methodname = `${AuthorizationAdminGuard.name}.canActivate`;

    this.logger.info(`${methodname} - In Admin Authorization Guard`);

    return await super.canActivate(context);
  }
}
