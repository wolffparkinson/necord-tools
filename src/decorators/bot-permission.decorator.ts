import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PermissionResolvable } from 'discord.js';

export const DISCORD_BOT_PERMISSION = 'discord:__bot_permission__';

import { BotPermissionGuard } from '../guards/bot-permission.guard';
export const BotPermissions = (...permissions: PermissionResolvable[]) => {
  return applyDecorators(
    SetMetadata(DISCORD_BOT_PERMISSION, permissions),
    UseGuards(BotPermissionGuard)
  );
};