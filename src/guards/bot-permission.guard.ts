import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PermissionResolvable, codeBlock, hyperlink } from "discord.js";
import { NecordExecutionContext } from "necord";
import { DISCORD_BOT_PERMISSION } from "../decorators/bot-permission.decorator";
import { UrlProvider } from "../providers";

@Injectable()
export class BotPermissionGuard implements CanActivate {
  private readonly logger = new Logger(BotPermissionGuard.name);
  constructor(
    private readonly reflector: Reflector,
    private readonly urls: UrlProvider
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = NecordExecutionContext.create(context);
    const [interaction] = ctx.getContext<"interactionCreate">();

    // Allow all DMs
    if (!interaction.inGuild()) return true;

    const permissions = this.reflector.getAllAndOverride<
      PermissionResolvable[]
    >(DISCORD_BOT_PERMISSION, [context.getHandler(), context.getClass()]);

    if (!permissions) return true;
    const me =
      interaction.guild?.members?.me ||
      (await interaction.guild?.members.fetchMe());
    if (me?.permissions.has(permissions)) return true;

    throw new ForbiddenException(
      `Bot does not have sufficient permissions to perform this action in this server.\n${codeBlock(
        "fix",
        `- ` + permissions.toString().split(",").join("\n- ")
      )}\n
      Use ${hyperlink(
        "this invite link",
        this.urls.botInvite(...permissions)
      )} to invite the bot with missing permissions`
    );
  }
}
