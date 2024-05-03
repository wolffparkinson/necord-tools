import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { NecordExecutionContext } from "necord";
import { config } from "~/config";

@Injectable()
export class BotDevGuard implements CanActivate {
  private readonly logger = new Logger(BotDevGuard.name);
  private readonly botDevIds = [config.devUserId];

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = NecordExecutionContext.create(context);
    const [i] = ctx.getContext<"interactionCreate">();
    if (this.botDevIds.includes(i.user.id)) {
      return true;
    }

    throw new ForbiddenException("This action limited to bot developers");
  }
}
