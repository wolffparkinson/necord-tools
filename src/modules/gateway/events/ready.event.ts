import { Injectable, Logger } from "@nestjs/common";
import { ActivityType } from "discord.js";
import { Context, ContextOf, Once } from "necord";

@Injectable()
export class ReadyEvent {
  private readonly logger = new Logger(ReadyEvent.name);

  @Once("ready")
  onReady(@Context() [client]: ContextOf<"ready">) {
    this.logger.log(`Bot is ready as ${client.user.username}`);
    return client.user?.setPresence({
      status: "online",
      afk: false,
      activities: [
        {
          name: "/help",
          type: ActivityType.Watching,
        },
      ],
    });
  }
}
