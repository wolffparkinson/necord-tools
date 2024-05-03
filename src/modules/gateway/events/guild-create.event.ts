import { Injectable, Logger } from '@nestjs/common';
import { Context, ContextOf, On } from 'necord';

@Injectable()
export class GuildCreateEvent {
  private readonly logger = new Logger(GuildCreateEvent.name);

  @On('guildCreate')
  async guildCreate(@Context() [guild]: ContextOf<'guildCreate'>) {
    this.logger.log(`Joined guild : ${guild.id}`);
  }
}
