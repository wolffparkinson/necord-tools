import { Module } from '@nestjs/common';
import { InviteCommand } from './invite.command';

@Module({
  imports: [],
  providers: [InviteCommand],
})
export class InviteModule {}
