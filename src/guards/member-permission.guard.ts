import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionResolvable, codeBlock } from 'discord.js';
import { NecordExecutionContext } from 'necord';
import { DISCORD_MEMBER_PERMISSION } from '../decorators';

@Injectable()
export class MemberPermissionGuard implements CanActivate {
  private readonly logger = new Logger(MemberPermissionGuard.name);

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = NecordExecutionContext.create(context);
    const [interaction] = ctx.getContext<'interactionCreate'>();

    // Allow all DMs
    if (!interaction.inGuild()) return true;

    // Member permissions
    const required = this.reflector.getAllAndOverride<PermissionResolvable[]>(
      DISCORD_MEMBER_PERMISSION,
      [context.getHandler(), context.getClass()]
    );

    if (!required) return true;
    if (interaction.memberPermissions.has(required)) return true;

    this.logger.debug(required, 'Member does not have sufficient permissions');

    throw new ForbiddenException(
      `You do not have sufficient permissions to perform this action.\nThis action requires you to have following permissions in this server : \n${codeBlock(
        'fix',
        `- ` + required.toString().split(',').join('\n- ')
      )}`
    );
  }
}
