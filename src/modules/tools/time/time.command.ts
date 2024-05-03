import { Injectable, UseInterceptors } from "@nestjs/common";
import { TimestampStyles, time } from "discord.js";
import { Ctx, Options, SlashCommand, SlashCommandContext } from "necord";
import { DateTimeAutocomplete } from "~/autocompletes";
import { isEphemeral } from "~/utils";
import { TimeCommandOptions } from "./time.options";

const DateInterceptor = new DateTimeAutocomplete({ name: "when" });

@Injectable()
export class TimestampCommand {
  @UseInterceptors(DateInterceptor)
  @SlashCommand({
    name: "timestamp",
    description: "Converts time/duration into a Discord timestamp",
  })
  onSlash(
    @Options()
    {
      when,
      ephemeralReply,
      format = TimestampStyles.LongDateTime,
    }: TimeCommandOptions,
    @Ctx() [i]: SlashCommandContext
  ) {
    const dt = DateInterceptor.parse(when);
    if (!dt) {
      return i.reply({
        ephemeral: true,
        embeds: [DateInterceptor.invalidEmbed(when)],
      });
    }

    const ephemeral = isEphemeral({ ephemeralReply });

    return i.reply({ ephemeral, content: time(dt.toJSDate(), format) });
  }
}
