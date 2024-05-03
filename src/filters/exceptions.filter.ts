import { ArgumentsHost, Catch, Logger } from "@nestjs/common";
import { BaseExceptionFilter, HttpAdapterHost } from "@nestjs/core";
import {
  BaseInteraction,
  DiscordAPIError,
  EmbedBuilder,
  Interaction,
  codeBlock,
} from "discord.js";
import startCase from "lodash/startCase";
import { NecordContextType } from "necord";
import { PastelColors } from "~/constants";

@Catch()
export class GlobalDiscordFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(GlobalDiscordFilter.name);
  constructor(override readonly httpAdapterHost: HttpAdapterHost) {
    super();
  }

  override async catch(exception: unknown, host: ArgumentsHost) {
    const hostType = host.getType<NecordContextType>();
    switch (hostType) {
      case "necord":
        return await this.necord(exception, host);

      default: {
        this.logger.error(exception);
        return super.catch(exception, host);
      }
    }
  }

  private async necord(exception: unknown, host: ArgumentsHost) {
    if (
      exception instanceof Error &&
      exception.message.includes("Unknown interaction")
    ) {
      this.logger.log(exception);
      return;
    }

    const [i] = host.getArgByIndex<[Interaction]>(0) ?? [undefined];

    const { title, description } = this.getMessage(exception);
    const message = {
      embeds: [
        new EmbedBuilder()
          .setColor(PastelColors.Error)
          .setTitle(title || "Error")
          .setDescription(description ?? "Yikes, something went wrong"),
      ],
    };

    if (i && i instanceof BaseInteraction && i.isRepliable()) {
      try {
        if (i.deferred) {
          if (i.isMessageComponent()) {
            await i.followUp({ ephemeral: true, ...message });
          } else {
            await i.editReply(message);
          }
        } else if (i.replied) {
          await i.followUp({ ...message, ephemeral: true });
        } else {
          await i.reply({ ...message, ephemeral: true });
        }
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  private getMessage(err: unknown): { title?: string; description?: string } {
    // Not instance of error
    if (!(err instanceof Error)) {
      this.logger.error(err);
      return { description: `${err}` };
    }

    this.logger.error(err);

    // DiscordAPIError
    if (err instanceof DiscordAPIError) {
      this.logger.warn(err);
      return {
        title: "Discord API Error",
        description: `Yikes we received an error from Discord :\n${codeBlock(
          "fix",
          err.message
        )}`,
      };
    }

    // Other errors
    return { description: err.message, title: startCase(err.name) };
  }
}
