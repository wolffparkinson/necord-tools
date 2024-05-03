import { Injectable, Logger } from '@nestjs/common';
import { Context, ContextOf, On } from 'necord';

@Injectable()
export class GuildDeleteEvent {
  private readonly logger = new Logger(GuildDeleteEvent.name);

  @On('guildDelete')
  async guildDelete(@Context() [guild]: ContextOf<'guildDelete'>) {
    this.logger.log(`Left guild : ${guild.id}`);
  }
}
