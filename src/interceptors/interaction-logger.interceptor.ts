import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { BaseInteraction, Interaction } from "discord.js";
import { NecordContextType } from "necord";
import { Observable } from "rxjs";

@Injectable()
export class InteractionLogger implements NestInterceptor {
  private readonly logger = new Logger(InteractionLogger.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctxType = context.getType<NecordContextType>();

    if (ctxType !== "necord") {
      return next.handle();
    }

    const [interaction] = context.getArgByIndex<[Interaction]>(0) ?? [
      undefined,
    ];

    if (interaction && interaction instanceof BaseInteraction) {
      if (interaction.isAutocomplete()) return next.handle();

      const map = new Map<string, any>();

      // Determine props to log
      map.set("type", interaction.type);
      map.set("userId", interaction.user.id);
      map.set("guildId", interaction.guildId);
      map.set("channelId", interaction.channelId);

      if (interaction.isMessageComponent()) {
        // if (this.ignoredComponents.has(interaction.customId))
        //   return next.handle();
        map.set("componentType", interaction.componentType);
        map.set("customId", interaction.customId);
        if (interaction.isAnySelectMenu())
          map.set("values", interaction.values);
      }
      if (interaction.isModalSubmit()) {
        map.set("customId", interaction.customId);
      }
      if (interaction.isCommand()) {
        map.set("commandName", interaction.commandName);
        map.set("args", interaction.options.data);
      }
      this.logger.log(Object.fromEntries(map));
    }

    return next.handle();
  }
}
