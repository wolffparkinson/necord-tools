import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PermissionResolvable } from 'discord.js';

export const DISCORD_MEMBER_PERMISSION = 'discord:__member_permission__';

import { MemberPermissionGuard } from '../guards';

/**
 * Restricts command to members with specific permissions
 * NOTE: use this decorator sparingly.
 * It is recommended to let guild administrators control command access at guild level via their guild settings
 */
export const MemberPermissions = (...permissions: PermissionResolvable[]) => {
  return applyDecorators(
    SetMetadata(DISCORD_MEMBER_PERMISSION, permissions),
    UseGuards(MemberPermissionGuard)
  );
};
