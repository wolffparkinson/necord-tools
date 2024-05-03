import { Injectable } from "@nestjs/common";
import { Client, Colors, EmbedBuilder, inlineCode } from "discord.js";
import { Context, Options, SlashCommand, SlashCommandContext } from "necord";
import { EphemeralOption } from "~/options";
import { isEphemeral } from "~/utils";
import { LinesBuilder, numberFormat } from "~/utils";

@Injectable()
export class StatsCommand {
  constructor(private readonly client: Client) {}

  @SlashCommand({
    name: "stats",
    description: "View bot statistics",
  })
  async onSlash(
    @Options() { ephemeralReply }: EphemeralOption,
    @Context() [i]: SlashCommandContext
  ) {
    const ephemeral = isEphemeral({ ephemeralReply });

    const embed = new EmbedBuilder()
      .setTitle("Stats")
      .setColor(Colors.DarkGreen)
      .setTimestamp()
      .setDescription(
        new LinesBuilder()
          .addField(`Servers`, this.formatValue(this.client.guilds.cache.size))
          .addField(
            `Users`,
            this.formatValue(
              this.client.guilds.cache.reduce(
                (total, guild) => total + guild.memberCount,
                0
              )
            )
          )
          .toString()
      );
    return i.reply({
      ephemeral,
      embeds: [embed],
    });
  }

  private formatValue(value: number) {
    return inlineCode(numberFormat.compactEn.format(value));
  }
}
